'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ApplicantFormProps } from '../types';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

export default function ApplicantForm({ 
  index, 
  register, 
  errors, 
  removeApplicant, 
  isRemovable 
}: ApplicantFormProps) {
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [portraitSelected, setPortraitSelected] = useState<boolean>(false);
  const [passportSelected, setPassportSelected] = useState<boolean>(false);
  
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const passportInputRef = useRef<HTMLInputElement>(null);

  const handlePortraitFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPortraitPreview(event.target.result);
          setPortraitSelected(true);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPortraitPreview(null);
      setPortraitSelected(false);
    }
  };

  const handlePassportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPassportPreview(event.target.result);
          setPassportSelected(true);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPassportPreview(null);
      setPassportSelected(false);
    }
  };
  
  // 当用户点击选择照片按钮时触发文件选择
  const triggerPortraitFileSelect = () => {
    if (portraitInputRef.current) {
      portraitInputRef.current.click();
    }
  };
  
  const triggerPassportFileSelect = () => {
    if (passportInputRef.current) {
      passportInputRef.current.click();
    }
  };

  // 当组件挂载时，确保状态与实际文件输入状态同步
  useEffect(() => {
    // 检查是否已经有文件被选择
    if (portraitInputRef.current?.files && portraitInputRef.current.files.length > 0) {
      setPortraitSelected(true);
    }
    if (passportInputRef.current?.files && passportInputRef.current.files.length > 0) {
      setPassportSelected(true);
    }
  }, []);

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
      {isRemovable && (
        <button
          type="button"
          onClick={() => removeApplicant(index)}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          aria-label="删除申请人"
        >
          ×
        </button>
      )}
      
      <h4 className="text-md font-medium mb-4">申请人 {index + 1}</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              肖像照片
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id={`portraitPhoto-${index}`}
              {...register(`applicants.${index}.portraitPhoto` as const, { 
                required: "肖像照片是必需的",
                onChange: handlePortraitFileChange,
                validate: () => {
                  return portraitSelected || "肖像照片是必需的";
                }
              })}
              ref={(e) => {
                // 同时设置react-hook-form的ref和我们自己的ref
                const { ref } = register(`applicants.${index}.portraitPhoto` as const);
                if (e) {
                  ref(e);
                  portraitInputRef.current = e;
                }
              }}
            />
            <div className="flex items-center">
              <button
                type="button"
                onClick={triggerPortraitFileSelect}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
              >
                选择照片
              </button>
              {portraitPreview ? (
                <div className="relative h-24 w-24">
                  <Image 
                    src={portraitPreview} 
                    alt="Portrait Preview" 
                    fill 
                    className="object-cover rounded"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-500">未选择文件</span>
              )}
            </div>
            {errors?.applicants && 
              typeof index === 'number' && 
              Array.isArray(errors.applicants) && 
              errors.applicants[index] && 
              typeof errors.applicants[index] === 'object' && 
              'portraitPhoto' in errors.applicants[index] && (
                <p className="text-red-500 text-xs mt-1">
                  {(errors.applicants[index] as any).portraitPhoto?.message?.toString()}
                </p>
            )}
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              护照照片
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id={`passportPhoto-${index}`}
              {...register(`applicants.${index}.passportPhoto` as const, { 
                required: "护照照片是必需的",
                onChange: handlePassportFileChange,
                validate: () => {
                  return passportSelected || "护照照片是必需的";
                }
              })}
              ref={(e) => {
                // 同时设置react-hook-form的ref和我们自己的ref
                const { ref } = register(`applicants.${index}.passportPhoto` as const);
                if (e) {
                  ref(e);
                  passportInputRef.current = e;
                }
              }}
            />
            <div className="flex items-center">
              <button
                type="button"
                onClick={triggerPassportFileSelect}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
              >
                选择照片
              </button>
              {passportPreview ? (
                <div className="relative h-24 w-24">
                  <Image 
                    src={passportPreview} 
                    alt="Passport Preview" 
                    fill 
                    className="object-cover rounded"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-500">未选择文件</span>
              )}
            </div>
            {errors?.applicants && 
              typeof index === 'number' && 
              Array.isArray(errors.applicants) && 
              errors.applicants[index] && 
              typeof errors.applicants[index] === 'object' && 
              'passportPhoto' in errors.applicants[index] && (
                <p className="text-red-500 text-xs mt-1">
                  {(errors.applicants[index] as any).passportPhoto?.message?.toString()}
                </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
