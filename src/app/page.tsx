'use client';

import Image from "next/image";
import dynamic from 'next/dynamic';

// 使用动态导入
const VisaApplicationForm = dynamic(
  () => import('../components/VisaApplicationForm')
);

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">申请电子签证</h1>
        <VisaApplicationForm />
      </main>
    </div>
  );
}
