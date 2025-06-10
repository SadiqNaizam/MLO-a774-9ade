import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import CheckoutProgressStepper from '@/components/CheckoutProgressStepper';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, CreditCard, Truck } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const steps = ["Delivery", "Payment", "Review"];

const addressSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(["creditCard", "paypal", "cod"], { required_error: "Payment method is required"}),
  cardNumber: z.string().optional().refine((val, ctx) => {
    if (ctx.parent.paymentMethod === "creditCard" && (!val || !/^\d{16}$/.test(val))) {
      return false;
    }
    return true;
  }, "Invalid card number (must be 16 digits)"),
  expiryDate: z.string().optional().refine((val, ctx) => {
     if (ctx.parent.paymentMethod === "creditCard" && (!val || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(val))) {
      return false;
    }
    return true;
  }, "Invalid expiry date (MM/YY)"),
  cvv: z.string().optional().refine((val, ctx) => {
    if (ctx.parent.paymentMethod === "creditCard" && (!val || !/^\d{3,4}$/.test(val))) {
      return false;
    }
    return true;
  }, "Invalid CVV (3 or 4 digits)"),
  saveCard: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

// Placeholder order summary, in real app this would come from cart state
const orderSummary = {
  items: [
    { name: 'Margherita Pizza', quantity: 1, price: 14.00 },
    { name: 'Tiramisu', quantity: 1, price: 9.00 },
  ],
  subtotal: 23.00,
  deliveryFee: 5.00,
  taxes: 1.84,
  total: 29.84,
};


const CheckoutScreen = () => {
  console.log('CheckoutScreen loaded');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState<AddressFormData | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentFormData | null>(null);

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { fullName: '', addressLine1: '', city: '', state: '', zipCode: '', phoneNumber: '' },
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: 'creditCard', cardNumber: '', expiryDate: '', cvv: '', saveCard: false },
  });

  const handleNextStep = async () => {
    if (currentStep === 0) { // Delivery Address
      const isValid = await addressForm.trigger();
      if (isValid) {
        setDeliveryAddress(addressForm.getValues());
        setCurrentStep(1);
      }
    } else if (currentStep === 1) { // Payment Method
      const isValid = await paymentForm.trigger();
      if (isValid) {
        setPaymentDetails(paymentForm.getValues());
        setCurrentStep(2);
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handlePlaceOrder = () => {
    // Simulate API call
    console.log("Placing order with:", { deliveryAddress, paymentDetails, orderSummary });
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your order. You'll receive a confirmation email shortly.",
      duration: 5000,
    });
    // Reset cart, navigate to a success page or home
    // For demo, navigate to home
    navigate('/');
  };
  
  const watchedPaymentMethod = paymentForm.watch("paymentMethod");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto p-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => currentStep === 0 ? navigate('/cart') : handlePrevStep()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800 ml-4">Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <CheckoutProgressStepper currentStep={currentStep} steps={steps} className="mb-8" />

        {currentStep === 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><Truck className="mr-2 h-5 w-5 text-orange-500"/>Delivery Address</CardTitle>
              <CardDescription>Where should we send your order?</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...addressForm}>
                <form onSubmit={addressForm.handleSubmit(handleNextStep)} className="space-y-4">
                  <FormField control={addressForm.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={addressForm.control} name="addressLine1" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={addressForm.control} name="addressLine2" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl><Input placeholder="Apartment, suite, etc." {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={addressForm.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl><Input placeholder="Flavor Town" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={addressForm.control} name="state" render={({ field }) => (
                       <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl><Input placeholder="CA" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={addressForm.control} name="zipCode" render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP / Postal Code</FormLabel>
                        <FormControl><Input placeholder="90210" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={addressForm.control} name="phoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input type="tel" placeholder="+1234567890" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">Continue to Payment</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-orange-500"/>Payment Method</CardTitle>
              <CardDescription>How would you like to pay?</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(handleNextStep)} className="space-y-4">
                  <FormField control={paymentForm.control} name="paymentMethod" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Select Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="creditCard" /></FormControl>
                            <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="paypal" /></FormControl>
                            <FormLabel className="font-normal">PayPal</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="cod" /></FormControl>
                            <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {watchedPaymentMethod === 'creditCard' && (
                    <div className="space-y-4 p-4 border rounded-md">
                        <FormField control={paymentForm.control} name="cardNumber" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={paymentForm.control} name="expiryDate" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )} />
                            <FormField control={paymentForm.control} name="cvv" render={({ field }) => (
                            <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl><Input placeholder="123" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )} />
                        </div>
                        <FormField control={paymentForm.control} name="saveCard" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Save card for future payments</FormLabel>
                            </div>
                            </FormItem>
                        )} />
                    </div>
                  )}
                   {watchedPaymentMethod === 'paypal' && (
                    <div className="p-4 border rounded-md text-center">
                        <p className="text-gray-600 mb-2">You will be redirected to PayPal to complete your payment.</p>
                        <Button type="button" variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
                            Login with PayPal
                        </Button>
                    </div>
                  )}
                  {watchedPaymentMethod === 'cod' && (
                     <div className="p-4 border rounded-md bg-yellow-50 text-yellow-700">
                        <p>Please have the exact amount ready for the delivery person. Additional charges may apply for Cash on Delivery.</p>
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>Back to Delivery</Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Continue to Review</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><Lock className="mr-2 h-5 w-5 text-orange-500"/>Review Your Order</CardTitle>
              <CardDescription>Please confirm all details before placing your order.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Delivery Address</AccordionTrigger>
                  <AccordionContent className="space-y-1 text-sm">
                    <p><strong>{deliveryAddress?.fullName}</strong></p>
                    <p>{deliveryAddress?.addressLine1}</p>
                    {deliveryAddress?.addressLine2 && <p>{deliveryAddress.addressLine2}</p>}
                    <p>{deliveryAddress?.city}, {deliveryAddress?.state} {deliveryAddress?.zipCode}</p>
                    <p>Phone: {deliveryAddress?.phoneNumber}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Payment Method</AccordionTrigger>
                  <AccordionContent className="text-sm">
                    <p>Method: {paymentDetails?.paymentMethod === 'creditCard' ? 'Credit Card' : (paymentDetails?.paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery')}</p>
                    {paymentDetails?.paymentMethod === 'creditCard' && paymentDetails.cardNumber && (
                      <p>Card: **** **** **** {paymentDetails.cardNumber.slice(-4)}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Order Items ({orderSummary.items.length})</AccordionTrigger>
                  <AccordionContent>
                    {orderSummary.items.map(item => (
                      <div key={item.name} className="flex justify-between py-1 text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <Separator className="my-2"/>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><Label>Subtotal:</Label> <span>${orderSummary.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><Label>Delivery:</Label> <span>${orderSummary.deliveryFee.toFixed(2)}</span></div>
                        <div className="flex justify-between"><Label>Taxes:</Label> <span>${orderSummary.taxes.toFixed(2)}</span></div>
                        <div className="flex justify-between font-semibold mt-1"><Label>Total:</Label> <span>${orderSummary.total.toFixed(2)}</span></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={handlePrevStep}>Back to Payment</Button>
                <Button onClick={handlePlaceOrder} className="bg-green-600 hover:bg-green-700 text-white">Place Order & Pay ${orderSummary.total.toFixed(2)}</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CheckoutScreen;