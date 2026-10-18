// ==========================================================================
// 🚀 UNIFIED DATA ACCESS LAYER (DB.JS)
// รองรับทั้ง Supabase Cloud Database และ LocalStorage (Fallback อัตโนมัติ)
// ข้อมูลจะลิ้งค์หากันได้ทุกเครื่องเมื่อต่อกับ Supabase
// ==========================================================================

const DB = (function() {
  let supabaseClient = null;
  let isCloudActive = false;

  // แปลงข้อมูลจาก Supabase (snake_case) เป็น JavaScript Object (camelCase)
  function formatOrderFromCloud(row) {
    if (!row) return null;
    const items = (row.items || row.order_items || []).map(i => ({
      id: i.id,
      color: i.color,
      size: i.size,
      quantity: Number(i.quantity) || 1,
      price: Number(i.price_per_unit) || 590
    }));

    const totalQty = items.reduce((sum, it) => sum + it.quantity, 0);

    return {
      id: row.id,
      orderNumber: row.order_number,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerContact: row.customer_contact || '',
      addressDetail: row.address_detail,
      subdistrict: row.subdistrict,
      district: row.district,
      province: row.province,
      postalCode: row.postal_code,
      totalAmount: Number(row.total_amount),
      shippingFee: Number(row.shipping_fee || 0),
      totalQuantity: totalQty,
      slipUrl: row.slip_url || '',
      status: row.status || 'pending_slip',
      trackingNumber: row.tracking_number || '',
      courierName: row.courier_name || 'Flash Express',
      adminNotes: row.admin_notes || '',
      createdAt: row.created_at,
      items: items
    };
  }

  function getSupabaseConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem('MTC_SUPABASE_CONFIG') || '{}');
      if (saved.url && saved.anonKey) {
        return saved;
      }
    } catch(e) {}

    if (window.APP_CONFIG && window.APP_CONFIG.supabase && window.APP_CONFIG.supabase.url && window.APP_CONFIG.supabase.anonKey) {
      return window.APP_CONFIG.supabase;
    }
    return null;
  }

  function init() {
    const config = getSupabaseConfig();
    if (config && config.url && config.anonKey && window.supabase) {
      try {
        supabaseClient = window.supabase.createClient(config.url, config.anonKey);
        isCloudActive = true;
      } catch(err) {
        console.warn("Supabase init error, falling back to local:", err);
        isCloudActive = false;
      }
    } else {
      isCloudActive = false;
    }
    return isCloudActive;
  }

  // เรียก init ทันทีที่โหลด
  init();

  return {
    init: init,
    isCloud: function() { return isCloudActive; },

    getClient: function() { return supabaseClient; },

    // ดึงออเดอร์ทั้งหมด
    getOrders: async function() {
      if (isCloudActive && supabaseClient) {
        try {
          const { data, error } = await supabaseClient
            .from('orders')
            .select('*, items:order_items(*)')
            .order('created_at', { ascending: false });

          if (error) throw error;
          return (data || []).map(formatOrderFromCloud);
        } catch(err) {
          console.error("Cloud fetch failed, using local fallback:", err);
        }
      }

      // Fallback: LocalStorage
      try {
        return JSON.parse(localStorage.getItem('MTC_ORDERS') || '[]');
      } catch(e) {
        return [];
      }
    },

    // ค้นหาออเดอร์ตามเบอร์โทรศัพท์ (สำหรับ tracking.html)
    findOrdersByPhone: async function(phoneQuery) {
      const cleanPhone = phoneQuery.replace(/[^0-9]/g, '');
      if (isCloudActive && supabaseClient) {
        try {
          const { data, error } = await supabaseClient
            .from('orders')
            .select('*, items:order_items(*)')
            .or(`customer_phone.eq.${cleanPhone},order_number.ilike.%${phoneQuery.trim()}%`)
            .order('created_at', { ascending: false });

          if (error) throw error;
          return (data || []).map(formatOrderFromCloud);
        } catch(err) {
          console.error("Cloud search failed, using local:", err);
        }
      }

      // Local fallback
      try {
        const local = JSON.parse(localStorage.getItem('MTC_ORDERS') || '[]');
        return local.filter(o => 
          (o.customerPhone && o.customerPhone.replace(/[^0-9]/g, '').includes(cleanPhone)) ||
          (o.orderNumber && o.orderNumber.toLowerCase().includes(phoneQuery.toLowerCase()))
        );
      } catch(e) {
        return [];
      }
    },

    // อัปโหลดสลิปไปยัง Supabase Storage Bucket
    uploadSlip: async function(base64Data, orderNumber) {
      if (!isCloudActive || !supabaseClient) {
        return base64Data; // คืน Base64 หากรันใน Local
      }

      try {
        const config = getSupabaseConfig();
        const bucket = (config && config.storageBucket) || 'payment_slips';
        
        // แปลง base64 เป็น Blob
        const parts = base64Data.split(';base64,');
        const contentType = parts[0].split(':')[1] || 'image/jpeg';
        const raw = window.atob(parts[1]);
        const uInt8Array = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: contentType });

        const fileName = `slip_${orderNumber}_${Date.now()}.jpg`;
        const { data, error } = await supabaseClient.storage
          .from(bucket)
          .upload(fileName, blob, {
            contentType: contentType,
            upsert: true
          });

        if (error) throw error;

        // รับ Public URL
        const { data: publicUrlData } = supabaseClient.storage
          .from(bucket)
          .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
      } catch(err) {
        console.warn("Storage upload failed, storing base64 inline:", err);
        return base64Data;
      }
    },

    // สร้างออเดอร์ใหม่
    createOrder: async function(order) {
      // 1. ถ้ามี Cloud
      if (isCloudActive && supabaseClient) {
        try {
          // Upload slip to Cloud Storage if available
          let finalSlipUrl = order.slipUrl;
          if (finalSlipUrl && finalSlipUrl.startsWith('data:image')) {
            finalSlipUrl = await this.uploadSlip(finalSlipUrl, order.orderNumber);
          }

          // Insert Order header
          const { data: insertedOrder, error: orderErr } = await supabaseClient
            .from('orders')
            .insert({
              order_number: order.orderNumber,
              customer_name: order.customerName,
              customer_phone: order.customerPhone,
              customer_contact: order.customerContact || null,
              address_detail: order.addressDetail,
              subdistrict: order.subdistrict,
              district: order.district,
              province: order.province,
              postal_code: order.postalCode,
              total_amount: order.totalAmount,
              shipping_fee: order.shippingFee,
              slip_url: finalSlipUrl,
              status: order.status || 'pending_slip',
              courier_name: order.courierName || 'Flash Express'
            })
            .select()
            .single();

          if (orderErr) throw orderErr;

          // Insert Items
          const itemsPayload = (order.items || []).map(item => ({
            order_id: insertedOrder.id,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price_per_unit: item.price || (order.totalAmount / (order.totalQuantity || 1))
          }));

          const { error: itemsErr } = await supabaseClient
            .from('order_items')
            .insert(itemsPayload);

          if (itemsErr) throw itemsErr;

          order.id = insertedOrder.id;
          order.slipUrl = finalSlipUrl;
        } catch(err) {
          console.error("Cloud insert failed, saving to LocalStorage:", err);
        }
      }

      // Always save to LocalStorage as well for backup / offline view
      try {
        let local = JSON.parse(localStorage.getItem('MTC_ORDERS') || '[]');
        local.unshift(order);
        localStorage.setItem('MTC_ORDERS', JSON.stringify(local));
      } catch(e) {}

      return order;
    },

    // อัปเดตออเดอร์ (เปลี่ยนสถานะ / ใส่เลขแทร็ก / แอดมินแก้ไขข้อมูลหรือสีไซส์)
    updateOrder: async function(orderId, updates, newItems = null) {
      if (isCloudActive && supabaseClient) {
        try {
          const payload = {};
          if (updates.status !== undefined) payload.status = updates.status;
          if (updates.trackingNumber !== undefined) payload.tracking_number = updates.trackingNumber;
          if (updates.courierName !== undefined) payload.courier_name = updates.courierName;
          if (updates.customerName !== undefined) payload.customer_name = updates.customerName;
          if (updates.customerPhone !== undefined) payload.customer_phone = updates.customerPhone;
          if (updates.customerContact !== undefined) payload.customer_contact = updates.customerContact;
          if (updates.addressDetail !== undefined) payload.address_detail = updates.addressDetail;
          if (updates.subdistrict !== undefined) payload.subdistrict = updates.subdistrict;
          if (updates.district !== undefined) payload.district = updates.district;
          if (updates.province !== undefined) payload.province = updates.province;
          if (updates.postalCode !== undefined) payload.postal_code = updates.postalCode;
          if (updates.totalAmount !== undefined) payload.total_amount = updates.totalAmount;
          if (updates.adminNotes !== undefined) payload.admin_notes = updates.adminNotes;
          payload.updated_at = new Date().toISOString();

          // 1. Update orders table
          const { error: updErr } = await supabaseClient
            .from('orders')
            .update(payload)
            .or(`id.eq.${orderId},order_number.eq.${orderId}`);

          if (updErr) throw updErr;

          // 2. If newItems provided (Admin edited shirt colors/sizes/quantities)
          if (Array.isArray(newItems) && newItems.length > 0) {
            // Find uuid if orderId is order_number
            let targetUUID = orderId;
            if (!orderId.includes('-') || orderId.startsWith('MTC-')) {
              const { data: ord } = await supabaseClient.from('orders').select('id').eq('order_number', orderId).single();
              if (ord) targetUUID = ord.id;
            }

            // Remove existing items and re-insert
            await supabaseClient.from('order_items').delete().eq('order_id', targetUUID);
            
            const itemsPayload = newItems.map(item => ({
              order_id: targetUUID,
              color: item.color,
              size: item.size,
              quantity: item.quantity,
              price_per_unit: item.price || 590
            }));
            await supabaseClient.from('order_items').insert(itemsPayload);
          }
        } catch(err) {
          console.error("Cloud update error:", err);
        }
      }

      // LocalStorage update
      try {
        let local = JSON.parse(localStorage.getItem('MTC_ORDERS') || '[]');
        local = local.map(o => {
          if (o.id === orderId || o.orderNumber === orderId) {
            const merged = { ...o, ...updates };
            if (Array.isArray(newItems)) {
              merged.items = newItems;
              merged.totalQuantity = newItems.reduce((sum, i) => sum + i.quantity, 0);
            }
            return merged;
          }
          return o;
        });
        localStorage.setItem('MTC_ORDERS', JSON.stringify(local));
      } catch(e) {}

      return true;
    },

    // ลบออเดอร์เดียว
    deleteOrder: async function(orderId) {
      if (isCloudActive && supabaseClient) {
        try {
          await supabaseClient.from('orders').delete().or(`id.eq.${orderId},order_number.eq.${orderId}`);
        } catch(err) {
          console.error("Cloud delete error:", err);
        }
      }

      try {
        let local = JSON.parse(localStorage.getItem('MTC_ORDERS') || '[]');
        local = local.filter(o => o.id !== orderId && o.orderNumber !== orderId);
        localStorage.setItem('MTC_ORDERS', JSON.stringify(local));
      } catch(e) {}
      return true;
    },

    // ล้างข้อมูลคำสั่งซื้อทั้งหมด (สำหรับแอดมินก่อนเปิดจองจริง)
    clearAllOrders: async function() {
      if (isCloudActive && supabaseClient) {
        try {
          // Delete all records in order_items & orders
          await supabaseClient.from('order_items').delete().neq('quantity', -999);
          await supabaseClient.from('orders').delete().neq('order_number', 'NEVER_MATCH');
        } catch(err) {
          console.error("Cloud wipe error:", err);
        }
      }
      localStorage.removeItem('MTC_ORDERS');
      return true;
    },

    // ทดสอบการเชื่อมต่อ Supabase
    testConnection: async function(url, anonKey) {
      if (!window.supabase) {
        return { success: false, message: "ไม่พบ Supabase Library กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต" };
      }
      try {
        const client = window.supabase.createClient(url, anonKey);
        const { data, error } = await client.from('orders').select('count', { count: 'exact', head: true });
        if (error) {
          return { success: false, message: error.message };
        }
        return { success: true, count: data };
      } catch(err) {
        return { success: false, message: err.message };
      }
    }
  };
})();

window.DB = DB;
