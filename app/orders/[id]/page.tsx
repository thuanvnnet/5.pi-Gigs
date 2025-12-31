"use client"

import { use, useEffect, useState, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  Package, ShieldCheck, Upload, FileText, AlertTriangle, 
  Clock, RefreshCw, Undo2, CheckCircle2, Hourglass, 
  CreditCard, Download 
} from "lucide-react"
import { toast } from "sonner"
import { usePiAuth } from "@/hooks/use-pi-auth"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IOrder } from "@/models/Order" // Import the IOrder interface

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = usePiAuth()
  
  const [order, setOrder] = useState<IOrder | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [fetchError, setFetchError] = useState<"auth" | "generic" | null>(null);
  // Form states
  const [deliveryLink, setDeliveryLink] = useState("")
  const [deliveryNote, setDeliveryNote] = useState("")
  const [reasonInput, setReasonInput] = useState("") 
  const [activeForm, setActiveForm] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Countdown & Progress
  const [timeLeft, setTimeLeft] = useState("")
  const [progressPercent, setProgressPercent] = useState(0)

  // Cấu hình giới hạn số lần sửa
  const MAX_REVISIONS = 3

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}`)
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          throw new Error('auth');
        }
        throw new Error('generic');
      }
      const data = await res.json()
      if (data.success) {
        setOrder(data.data)
      } else {
        throw new Error('generic');
      }
    } catch (error) {
      const type = (error as Error).message as typeof fetchError;
      setFetchError(type);
      if (type === 'generic') {
        toast.error("Could not load order details.");
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  const calculateTimeLeft = useCallback((targetDate: Date) => {
    const now = new Date().getTime()
    const totalDuration = 3 * 24 * 60 * 60 * 1000 
    const distance = targetDate.getTime() - now
    const elapsed = totalDuration - distance
    const percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
    setProgressPercent(percent)

    if (distance < 0) {
      setTimeLeft("Finalizing...")
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      setTimeLeft(`${days}d ${hours}h ${minutes}m`)
    }
  }, [])

  const handleAction = useCallback(async (payload: any) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        let errorMsg = "Action failed.";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          errorMsg = `Request failed: ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }
      const data = await res.json()
      if (data.success) {
        toast.success("Updated successfully!")
        fetchOrder()
        setActiveForm(null)
        setReasonInput("")
      } else {
        throw new Error(data.error || "An unknown error occurred.");
      }
    } catch (err) {
      toast.error((err as Error).message || "Connection Error");
    } finally {
      setActionLoading(false)
    }
  }, [id, fetchOrder])

  // --- Specific Action Handlers for better readability and structure ---
  const handlePay = useCallback(() => {
    handleAction({ action: "pay" });
  }, [handleAction]);

  const handleDeliver = useCallback(() => {
    if (!deliveryLink) {
      toast.warning("Please provide a delivery file link.");
      return;
    }
    handleAction({ 
      action: "deliver", 
      deliveryFile: deliveryLink, 
      deliveryNote: deliveryNote 
    });
  }, [handleAction, deliveryLink, deliveryNote]);

  const handleRequestRevision = useCallback(() => {
    if (!reasonInput) {
      toast.warning("Please describe the changes you want.");
      return;
    }
    handleAction({ action: "revision", disputeReason: reasonInput });
  }, [handleAction, reasonInput]);

  const handleSubmitReport = useCallback(() => {
    if (!reasonInput) {
      toast.warning("Please describe the issue in detail.");
      return;
    }
    handleAction({ action: "dispute", disputeReason: reasonInput });
  }, [handleAction, reasonInput]);

  const handleRefund = useCallback(() => handleAction({ action: "refund" }), [handleAction]);

  useEffect(() => {
    if (order?.status === "delivered" && order.autoCompleteAt) {
      const targetDate = new Date(order.autoCompleteAt);

      const checkAndComplete = () => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
          // Check against the closed-over order status. This is safe because
          // this effect is re-run when `order` changes, clearing the old timer.
          if (order.status === 'delivered') {
            handleAction({ action: "complete" });
          }
        } else {
          calculateTimeLeft(targetDate);
        }
      };

      checkAndComplete(); // Initial check for immediate UI update
      const timer = setInterval(checkAndComplete, 10000); // Check every 10 seconds
      
      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [order, calculateTimeLeft, handleAction])

  useEffect(() => { if (id) fetchOrder() }, [id, fetchOrder])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1dbf73]"></div></div>
  
  if (fetchError === 'auth' || (order && user?.username !== order.buyerId && user?.username !== order.sellerId)) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] font-sans">
        <Header />
        <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center h-[60vh]">
          <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Access Denied</h1>
          <p className="text-gray-500 mt-2 max-w-md">You do not have permission to view this order. Please log in with the correct account or return to the homepage.</p>
          <Button asChild className="mt-6 bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold">
            <a href="/">Go to Homepage</a>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) return <div className="min-h-screen flex items-center justify-center text-gray-500">Order not found</div>

  const isBuyer = user?.username === order.buyerId
  const isSeller = user?.username === order.sellerId

  const steps = [
    { id: "created", label: "Order Placed", icon: CreditCard },
    { id: "in_progress", label: "In Progress", icon: Hourglass },
    { id: "delivered", label: "Delivered", icon: Package },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
  ]
  const currentStepIndex = steps.findIndex(s => s.id === (order.status === "disputed" || order.status === "cancelled" ? "delivered" : order.status))

  return (
    <div className="min-h-screen bg-[#F7F9FB] font-sans">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* --- HEADER & TIMELINE --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400 text-sm font-medium">Order #{order._id.toString().slice(0, 8)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border
                  ${order.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 
                    order.status === 'disputed' ? 'bg-red-100 text-red-700 border-red-200' :
                    order.status === 'cancelled' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                    order.status === 'delivered' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    'bg-blue-100 text-blue-700 border-blue-200'}`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{order.gigTitle}</h1>
            </div>
            <div className="text-right">
               <p className="text-3xl font-extrabold text-[#1dbf73]">{order.price} π</p>
            </div>
          </div>

          <div className="relative flex justify-between w-full max-w-3xl mx-auto mb-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full -z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-[#1dbf73] -translate-y-1/2 rounded-full -z-0 transition-all duration-500"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>
            {steps.map((step, idx) => {
              const isActive = idx <= currentStepIndex;
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                    ${isActive ? 'bg-[#1dbf73] border-[#1dbf73] text-white shadow-md' : 'bg-white border-gray-200 text-gray-300'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* STATE 1: CREATED - SUMMARY */}
            {order.status === "created" && (
               <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="bg-green-50 p-6 text-center border-b border-green-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                       <CreditCard className="w-8 h-8 text-[#1dbf73]" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Payment Required</h3>
                    <p className="text-gray-500 text-sm">Please complete payment to start the order.</p>
                  </div>
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                       {order.gigImage ? (
                          <img src={order.gigImage} alt="Gig" className="w-20 h-20 rounded-lg object-cover shadow-sm border border-gray-200 bg-white" />
                       ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                             <Package className="w-8 h-8 text-gray-400" />
                          </div>
                       )}
                       <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg line-clamp-2 mb-1">{order.gigTitle}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                             <span>Seller:</span>
                             <span className="font-medium text-gray-900 bg-gray-200 px-2 py-0.5 rounded text-xs">@{order.sellerId}</span>
                          </div>
                       </div>
                    </div>
                    {isBuyer && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-medium text-gray-500 px-2">
                           <span>Total Amount:</span>
                           <span className="text-xl font-bold text-gray-900">{order.price} π</span>
                        </div>
                        <Button onClick={handlePay} disabled={actionLoading} className="w-full bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold py-6 text-lg shadow-md transition-all hover:scale-[1.02]">
                          {actionLoading ? "Processing..." : "Pay Securely with Pi"}
                        </Button>
                        <p className="text-xs text-center text-gray-400">Funds will be held in Escrow until you approve the work.</p>
                      </div>
                    )}
                    {isSeller && (
                       <div className="text-center bg-yellow-50 p-4 rounded-xl text-yellow-700 font-medium">⏳ Waiting for the buyer to confirm payment...</div>
                    )}
                  </div>
               </div>
            )}

            {/* STATE 2: IN PROGRESS */}
            {order.status === "in_progress" && (
               <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
                  {isBuyer && (
                    <div className="text-center py-4">
                       <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow">
                         <RefreshCw className="w-8 h-8" />
                       </div>
                       <h3 className="font-bold text-xl text-gray-900">Seller is working hard...</h3>
                       <p className="text-gray-500 mt-2">Expect delivery soon. You will be notified via email/app.</p>
                       {order.expectedDeliveryAt && (
                         <p className="text-sm text-gray-400 mt-4">
                           Expected delivery by: <span className="font-semibold text-gray-500">{new Date(order.expectedDeliveryAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                         </p>
                       )}
                    </div>
                  )}
                  {isSeller && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-2 rounded-lg"><Upload className="w-6 h-6 text-[#1dbf73]" /></div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">Deliver Your Work</h3>
                          <p className="text-xs text-gray-500">Upload your files to cloud and paste the link here.</p>
                        </div>
                      </div>
                      {order.revisionsCount > 0 && (
                        <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                          <RefreshCw className="w-5 h-5 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-bold block">Revision #{order.revisionsCount} Requested</span>
                            <span className="text-sm opacity-80">Check the feedback and deliver again.</span>
                          </div>
                        </div>
                      )}
                      <div className="space-y-5">
                        <div>
                           <label className="text-sm font-bold text-gray-700 mb-1.5 block">File Link (Drive/Dropbox/Cloudinary)</label>
                           <Input className="h-12 bg-gray-50" placeholder="https://..." value={deliveryLink} onChange={(e) => setDeliveryLink(e.target.value)} />
                        </div>
                        <div>
                           <label className="text-sm font-bold text-gray-700 mb-1.5 block">Delivery Note</label>
                           <Textarea className="min-h-[120px] bg-gray-50" placeholder="Describe what you have done..." value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} />
                        </div>
                        <Button onClick={handleDeliver} disabled={!deliveryLink || actionLoading} className="w-full bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold py-6 text-lg shadow-md">
                          {actionLoading ? "Uploading..." : "Send Delivery"}
                        </Button>
                      </div>
                    </div>
                  )}
               </div>
            )}

            {/* STATE 3: DELIVERED / COMPLETED / DISPUTED */}
            {(["delivered", "completed", "disputed", "cancelled"].includes(order.status)) && (
              <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all duration-300
                ${order.status === 'disputed' ? 'bg-red-50 border-red-200' : 'bg-white border-orange-100'}`}>
                
                {/* Header Card */}
                <div className={`p-4 flex items-center gap-3 border-b ${order.status === 'disputed' ? 'bg-red-100 border-red-200' : 'bg-gradient-to-r from-orange-50 to-white border-orange-100'}`}>
                  <Package className={`w-5 h-5 ${order.status === 'disputed' ? 'text-red-600' : 'text-orange-600'}`} />
                  <h3 className={`font-bold ${order.status === 'disputed' ? 'text-red-800' : 'text-orange-900'}`}>Delivery Package</h3>
                </div>

                <div className="p-6">
                  {/* Note Bubble */}
                  <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-600">
                      {isSeller ? "Me" : "S"}
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] text-gray-700 text-sm leading-relaxed">
                      {order.deliveryNote || "Here is your delivery!"}
                    </div>
                  </div>

                  {/* FILE CARD */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow mb-6 group">
                      <div className="flex items-center gap-4 overflow-hidden">
                         <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                           <FileText className="w-6 h-6" />
                         </div>
                         <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate max-w-[200px] md:max-w-xs">{order.deliveryFile}</p>
                            <p className="text-xs text-gray-400">External Link</p>
                         </div>
                      </div>
                      <a href={order.deliveryFile} target="_blank" rel="noreferrer">
                         <Button variant="outline" className="border-gray-200 text-orange-600 hover:bg-orange-50">
                            <Download className="w-4 h-4 mr-2" /> Download
                         </Button>
                      </a>
                  </div>

                  {/* BUYER ACTIONS */}
                  {isBuyer && order.status === "delivered" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                       {/* 👇 REVISION LIMIT DISPLAY */}
                       <div className="mb-4 text-center">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border
                            ${order.revisionsCount >= MAX_REVISIONS 
                              ? 'bg-gray-100 text-gray-500 border-gray-200' 
                              : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            Revisions used: {order.revisionsCount} / {MAX_REVISIONS}
                          </span>
                       </div>

                       {!activeForm && (
                         <div className="grid grid-cols-2 gap-4">
                           {/* 👇 NÚT REVISION VỚI LOGIC DISABLE */}
                           {order.revisionsCount < MAX_REVISIONS ? (
                             <Button onClick={() => setActiveForm('revision')} variant="outline" className="h-12 font-bold border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                               <RefreshCw className="w-4 h-4 mr-2" /> Request Revision
                             </Button>
                           ) : (
                             <Button disabled variant="outline" className="h-12 border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50">
                               <RefreshCw className="w-4 h-4 mr-2" /> Limit Reached
                             </Button>
                           )}

                           <Button onClick={() => setActiveForm('dispute')} variant="ghost" className="h-12 font-bold text-red-500 hover:bg-red-50 hover:text-red-700">
                             <AlertTriangle className="w-4 h-4 mr-2" /> Report Problem
                           </Button>
                         </div>
                       )}

                       {/* 👇 THÔNG BÁO HẾT LƯỢT */}
                       {!activeForm && order.revisionsCount >= MAX_REVISIONS && (
                          <p className="text-xs text-center text-red-400 mt-2 italic">
                            You have used all revision requests. If the work is still incomplete, please Report Problem.
                          </p>
                       )}

                       {activeForm === 'revision' && (
                         <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                           <h4 className="font-bold text-gray-800 mb-2">Request Changes</h4>
                           <Textarea className="bg-white mb-3" placeholder="What would you like the seller to change?" value={reasonInput} onChange={(e) => setReasonInput(e.target.value)} />
                           <div className="flex gap-2">
                             <Button onClick={() => setActiveForm(null)} variant="ghost" className="flex-1">Cancel</Button>
                             <Button onClick={handleRequestRevision} disabled={actionLoading || !reasonInput} className="flex-1 bg-blue-600 text-white font-bold">{actionLoading ? "Sending..." : "Send Request"}</Button>
                           </div>
                         </div>
                       )}
                       {activeForm === 'dispute' && (
                         <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                           <h4 className="font-bold text-red-800 mb-2">Report / Dispute</h4>
                           <Textarea className="bg-white mb-3" placeholder="Describe the issue..." value={reasonInput} onChange={(e) => setReasonInput(e.target.value)} />
                           <div className="flex gap-2">
                             <Button onClick={() => setActiveForm(null)} variant="ghost" className="flex-1">Cancel</Button>
                             <Button onClick={handleSubmitReport} disabled={actionLoading || !reasonInput} className="flex-1 bg-red-600 text-white font-bold">{actionLoading ? "Submitting..." : "Submit Report"}</Button>
                           </div>
                         </div>
                       )}
                    </div>
                  )}

                  {/* DISPUTE STATUS */}
                  {order.status === "disputed" && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-xl flex items-start gap-3">
                       <AlertTriangle className="w-5 h-5 mt-0.5" />
                       <div>
                         <span className="font-bold block">Dispute in Progress</span>
                         <span className="text-sm">Buyer reported: "{order.disputeReason}". Admin will intervene shortly.</span>
                         {isSeller && (
                            <Button onClick={handleRefund} disabled={actionLoading} className="mt-3 bg-white text-red-600 border border-red-200 hover:bg-red-50 w-full">
                              {actionLoading ? "Refunding..." : "Accept Fault & Refund"}
                            </Button>
                         )}
                       </div>
                    </div>
                  )}
                  {order.status === "cancelled" && (
                     <div className="bg-gray-100 p-4 rounded-xl text-center text-gray-500 font-bold">
                        <Undo2 className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        Order Cancelled & Refunded.
                     </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* --- CỘT PHẢI: INFO & SIDEBAR --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 1. ESCROW BOX */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
               <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                 <ShieldCheck className="w-6 h-6 text-[#1dbf73]" />
               </div>
               <h3 className="font-bold text-gray-900">Escrow Protection</h3>
               <p className="text-xs text-gray-400 mt-1 mb-4">Funds are held securely until completion.</p>
               <div className={`py-3 px-4 rounded-xl font-bold text-sm border 
                 ${order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' : 
                   order.status === 'cancelled' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                   'bg-gray-50 text-gray-600 border-gray-100'}`}>
                 {order.status === 'completed' ? 'FUNDS RELEASED' : 
                  order.status === 'cancelled' ? 'REFUNDED' : 'FUNDS HELD'}
               </div>
            </div>

            {/* 2. AUTO-ACCEPT TIMER (ĐÃ ĐỒNG BỘ STYLE) */}
            {order.status === "delivered" && (
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-gray-900">Auto-Accept Timer</h3>
                  
                  <div className="text-3xl font-extrabold text-gray-900 mt-2 mb-1 tracking-tight">{timeLeft}</div>
                  <p className="text-xs text-gray-400 mb-4">Time remaining to review</p>
                  
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                  </div>
               </div>
            )}
            
            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
               <p className="text-xs text-gray-400">Need help with this order?</p>
               <Button variant="link" className="text-[#1dbf73] h-auto p-0 text-xs font-bold">Contact Support</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}