import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// 🟢 เปลี่ยนมาใช้ process.env แทน เพื่อซ่อนคีย์ไม่ให้ GitHub เห็น
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(request: Request) {
  try {
    const { cart } = await request.json();

    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: 'thb',
        product_data: {
          name: item.title,
          // 🛑 ลบบรรทัด images: [item.image_url] ออกไปแล้ว 
          // เพื่อแก้ปัญหา Error empty string ของ Stripe
        },
        unit_amount: item.price * 100, 
      },
      quantity: 1, 
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}