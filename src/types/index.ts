import { UseFormRegister, FieldErrors } from 'react-hook-form';

export type ApplicantFormProps = {
  index: number;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  removeApplicant: (index: number) => void;
  isRemovable: boolean;
};

export type ModalProps = {
  message: string;
  onClose: () => void;
};

export type PaymentOptionsProps = {
  onSelect: (option: 'now' | 'later') => void;
  onCancel: () => void;
};

export type FormData = {
  startDate: string;
  visaValidity: string;
  entryPoint: string;
  visaType: string;
  processingTime: string;
  entryPurpose: string;
  accommodation: string;
  province: string;
  phoneNumber: string;
  applicants: {
    portraitPhoto: FileList | null;
    passportPhoto: FileList | null;
  }[];
  paymentOption: 'now' | 'later';
};
