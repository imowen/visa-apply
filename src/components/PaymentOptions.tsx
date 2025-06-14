'use client';

import { useState } from 'react';
import { PaymentOptionsProps } from '@/types';

export default function PaymentOptions({ onSelect, onCancel }: PaymentOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<'now' | 'later'>('now');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect(selectedOption);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4 text-center">选择支付方式</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                 onClick={() => setSelectedOption('now')}>
              <input
                type="radio"
                id="payNow"
                name="paymentOption"
                value="now"
                checked={selectedOption === 'now'}
                onChange={() => setSelectedOption('now')}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="payNow" className="ml-3 block cursor-pointer w-full">
                <div className="font-medium">现在支付</div>
                <div className="text-sm text-gray-500">立即完成支付流程</div>
              </label>
            </div>
            
            <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                 onClick={() => setSelectedOption('later')}>
              <input
                type="radio"
                id="payLater"
                name="paymentOption"
                value="later"
                checked={selectedOption === 'later'}
                onChange={() => setSelectedOption('later')}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="payLater" className="ml-3 block cursor-pointer w-full">
                <div className="font-medium">稍后支付</div>
                <div className="text-sm text-gray-500">先提交申请，稍后再支付</div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
