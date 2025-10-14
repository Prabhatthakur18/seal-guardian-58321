import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import InstallerDetails from "./steps/InstallerDetails";
import CustomerDetails from "./steps/CustomerDetails";
import CarDetails from "./steps/CarDetails";
import ProductInfo from "./steps/ProductInfo";

export interface EVFormData {
  // Installer Details
  dealerName: string;
  dealerEmail: string;
  dealerMobile: string;
  dealerAddr1: string;
  dealerAddr2: string;
  dealerState: string;
  dealerCity: string;
  dealerPostalCode: string;
  
  // Customer Details
  customerFname: string;
  customerLname: string;
  customerMobile: string;
  customerEmail: string;
  custAddr1: string;
  custAddr2: string;
  custState: string;
  custCity: string;
  custPostalCode: string;
  
  // Car Details
  installationDate: string;
  carModel: string;
  carReg: string;
  
  // Product Info
  product: string;
  lotNumber: string;
  rollNumber: string;
  installArea: string;
  lhsPhoto: File | null;
  rhsPhoto: File | null;
  frontRegPhoto: File | null;
  backRegPhoto: File | null;
  warrantyPhoto: File | null;
  termsAccepted: boolean;
}

const EVProductsForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<EVFormData>({
    dealerName: "",
    dealerEmail: "",
    dealerMobile: "",
    dealerAddr1: "",
    dealerAddr2: "",
    dealerState: "",
    dealerCity: "",
    dealerPostalCode: "",
    customerFname: "",
    customerLname: "",
    customerMobile: "",
    customerEmail: "",
    custAddr1: "",
    custAddr2: "",
    custState: "",
    custCity: "",
    custPostalCode: "",
    installationDate: "",
    carModel: "",
    carReg: "",
    product: "",
    lotNumber: "",
    rollNumber: "",
    installArea: "",
    lhsPhoto: null,
    rhsPhoto: null,
    frontRegPhoto: null,
    backRegPhoto: null,
    warrantyPhoto: null,
    termsAccepted: false,
  });

  const steps = [
    { number: 1, label: "Installer Details" },
    { number: 2, label: "Customer Details" },
    { number: 3, label: "Car Details" },
    { number: 4, label: "Product Info" },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // TODO: Implement API call to submit form
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Success",
      description: "Your EV product warranty registration has been submitted successfully!",
    });

    setLoading(false);
    setCurrentStep(1);
    // Reset form if needed
  };

  const updateFormData = (updates: Partial<EVFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const progress = (currentStep / 4) * 100;

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex flex-col items-center ${
                  step.number <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                    step.number <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.number}
                </div>
                <span className="text-xs md:text-sm text-center">{step.label}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Steps */}
        {currentStep === 1 && (
          <InstallerDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <CustomerDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {currentStep === 3 && (
          <CarDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {currentStep === 4 && (
          <ProductInfo
            formData={formData}
            updateFormData={updateFormData}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EVProductsForm;
