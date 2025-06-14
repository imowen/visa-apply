'use client';

import { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { FormData as VisaFormData, ApplicantFormProps, ModalProps, PaymentOptionsProps } from '../types';

// 动态导入组件，指定类型
const ApplicantForm = dynamic<ApplicantFormProps>(() => import('./ApplicantForm').then(mod => ({ default: mod.default })));
const Modal = dynamic<ModalProps>(() => import('./Modal').then(mod => ({ default: mod.default })));
const PaymentOptions = dynamic<PaymentOptionsProps>(() => import('./PaymentOptions').then(mod => ({ default: mod.default })));

export default function VisaApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [formData, setFormData] = useState<VisaFormData | null>(null);

  const { register, control, handleSubmit, formState: { errors } } = useForm<VisaFormData>({
    defaultValues: {
      applicants: [{ portraitPhoto: null, passportPhoto: null }],
      paymentOption: 'now'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "applicants" as const
  });

  const addApplicant = () => {
    append({ portraitPhoto: null, passportPhoto: null });
  };

  const removeApplicant = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: VisaFormData) => {
    setFormData(data);
    setShowPaymentOptions(true);
  };

  const handlePaymentOptionSelected = async (option: 'now' | 'later') => {
    if (!formData) return;
    
    setShowPaymentOptions(false);
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // 添加基本表单数据
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'applicants' && key !== 'paymentOption') {
          formDataToSend.append(key, value as string);
        }
      });
      
      // 添加支付选项
      formDataToSend.append('paymentOption', option);
      
      // 添加申请人照片
      formData.applicants.forEach((applicant, index) => {
        if (applicant.portraitPhoto && applicant.portraitPhoto[0]) {
          formDataToSend.append(`portraitPhoto${index + 1}`, applicant.portraitPhoto[0]);
        }
        if (applicant.passportPhoto && applicant.passportPhoto[0]) {
          formDataToSend.append(`passportPhoto${index + 1}`, applicant.passportPhoto[0]);
        }
      });

      const response = await fetch('/api/apply', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        if (option === 'later') {
          setModalMessage('申请已成功提交，我们会通过邮件与您联系。您选择了稍后支付。');
        } else {
          setModalMessage('申请已成功提交，我们会通过邮件与您联系。感谢您的支付。');
        }
      } else {
        setModalMessage(result.message || '提交申请时出现错误，请稍后重试。');
      }
    } catch (error) {
      console.error('Error:', error);
      setModalMessage('提交申请时出现错误，请稍后重试。');
    } finally {
      setIsSubmitting(false);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">计划入境日期 *</label>
            <input
              type="date"
              id="startDate"
              {...register('startDate', { required: '请选择入境日期' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
          </div>
          
          <div>
            <label htmlFor="visaValidity" className="block text-sm font-medium text-gray-700 mb-1">电子签证有效期 *</label>
            <select
              id="visaValidity"
              {...register('visaValidity', { required: '请选择签证有效期' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">选择有效期</option>
              <option value="30">30天</option>
              <option value="90">90天</option>
            </select>
            {errors.visaValidity && <p className="text-red-500 text-xs mt-1">{errors.visaValidity.message}</p>}
          </div>

          <div>
            <label htmlFor="entryPoint" className="block text-sm font-medium text-gray-700 mb-1">入境地点 *</label>
            <select
              id="entryPoint"
              {...register('entryPoint', { required: '请选择入境地点' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">选择入境地点</option>
              <option value="河内">河内机场</option>
              <option value="胡志明">胡志明机场</option>
              <option value="海港1">海港1</option>
            </select>
            {errors.entryPoint && <p className="text-red-500 text-xs mt-1">{errors.entryPoint.message}</p>}
          </div>

          <div>
            <label htmlFor="visaType" className="block text-sm font-medium text-gray-700 mb-1">电子签证类型 *</label>
            <select
              id="visaType"
              {...register('visaType', { required: '请选择签证类型' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">选择签证类型</option>
              <option value="single">单次</option>
              <option value="multiple">多次</option>
            </select>
            {errors.visaType && <p className="text-red-500 text-xs mt-1">{errors.visaType.message}</p>}
          </div>

          <div>
            <label htmlFor="processingTime" className="block text-sm font-medium text-gray-700 mb-1">处理时间 *</label>
            <select
              id="processingTime"
              {...register('processingTime', { required: '请选择处理时间' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">选择处理时间</option>
              <option value="normal">普通</option>
              <option value="express">加急</option>
            </select>
            {errors.processingTime && <p className="text-red-500 text-xs mt-1">{errors.processingTime.message}</p>}
          </div>

          <div>
            <label htmlFor="entryPurpose" className="block text-sm font-medium text-gray-700 mb-1">入境目的 *</label>
            <select
              id="entryPurpose"
              {...register('entryPurpose', { required: '请选择入境目的' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">选择入境目的</option>
              <option value="tourism">旅游</option>
              <option value="business">商务</option>
              <option value="visit">探亲访友</option>
            </select>
            {errors.entryPurpose && <p className="text-red-500 text-xs mt-1">{errors.entryPurpose.message}</p>}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 mb-1">抵达越南时预计的住宿地址</label>
          <input
            type="text"
            id="accommodation"
            placeholder="酒店名称、地址"
            {...register('accommodation')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">省份</label>
            <select
              id="province"
              {...register('province')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">选择省份</option>
              <option value="hanoi">河内</option>
              <option value="hochiminh">胡志明市</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">联系电话号码</label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="输入电话号码"
              {...register('phoneNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">申请人信息</h3>
          
          {fields.map((field, index) => (
            <ApplicantForm 
              key={field.id} 
              index={index} 
              register={register} 
              errors={errors} 
              removeApplicant={removeApplicant}
              isRemovable={fields.length > 1}
            />
          ))}
          
          <button
            type="button"
            onClick={addApplicant}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            添加申请人
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-8 w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? '提交中...' : '申请'}
        </button>
      </form>

      {showPaymentOptions && (
        <PaymentOptions 
          onSelect={handlePaymentOptionSelected} 
          onCancel={() => setShowPaymentOptions(false)} 
        />
      )}

      {showModal && (
        <Modal message={modalMessage} onClose={closeModal} />
      )}
    </>
  );
}
