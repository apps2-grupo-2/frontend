export type StepNavigationProps = {
  backBtn?: {
    onClick?: () => void;
    disabled?: boolean;
    hidden?: boolean;
  };
  nextBtn?: {
    disabled?: boolean;
    hidden?: boolean;
  };
};
