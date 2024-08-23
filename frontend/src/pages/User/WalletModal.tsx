import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { WalletModalProps } from "../../types";
import { useAddMoneytoWalletMutation, useCreateWalletAddIntentMutation } from "../../utils/redux/slices/userApiSlices";
import { useErrorHandler } from "./ErrorBoundary";
import { useDispatch } from "react-redux";
import { setUser } from "../../utils/redux/slices/userAuthSlice";
import { toast } from "react-toastify";

const WalletModal: React.FC<WalletModalProps> = ({ setAddMoneyModal }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>()
    const[createWalletAddIntent] = useCreateWalletAddIntentMutation()
    const[addMoneytoWallet] = useAddMoneytoWalletMutation()
    const dispatch = useDispatch()
    const handleError = useErrorHandler()
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError("Card details are missing.");
            return;
        }
        const { error: cardError } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (cardError) {
            setError(cardError.message || "Invalid card details.");
            return;
        }
        setLoading(true);
        setError(null);
        
        try {
            const response = await createWalletAddIntent({amount:amount*100}).unwrap()
            const { client_secret } = response
            const { error: stripeError } = await stripe.confirmCardPayment(client_secret,{
                payment_method: {
                    card: cardElement,
                },
            })
            if (stripeError) {
                setError(stripeError.message || "An error occurred");
            } else {
                const res = await addMoneytoWallet({amount}).unwrap() 
                dispatch(setUser(res))
                setAddMoneyModal(false);
                toast.success('Amount added successfully to the wallet')
            }
        } catch (error:any) {
            handleError(error.data.message)
            setError("An error occurred while processing the payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md slide-in">
                <button
                    onClick={() => setAddMoneyModal(false)}
                    className="text-3xl  float-right top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold mb-4">Add Money to Wallet</h2>
                    <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}

                        placeholder="Enter amount"
                        className="mb-4 p-2 border rounded w-full"
                    />
                    <div className="mb-4">
                        <CardElement
                            className="p-2 border rounded w-full"
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#424770",
                                        "::placeholder": {
                                            color: "#aab7c4",
                                        },
                                    },
                                    invalid: {
                                        color: "#9e2146",
                                    },
                                },
                            }}
                        />
                    </div>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <button
                        type="submit"
                        disabled={!stripe || loading}
                        className="w-full p-2 bg-zinc-900 text-white rounded"
                    >
                        {loading ? "Processing..." : "Add Money"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WalletModal;
