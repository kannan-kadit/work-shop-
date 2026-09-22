import React from 'react';
import { 
  Printer, 
  Share2, 
  CheckCircle, 
  Clock, 
  X, 
  FileText, 
  QrCode, 
  Phone, 
  MapPin, 
  Building2,
  Bike
} from 'lucide-react';
import { JobCard, PaymentStatus, PaymentMethod } from '../types';
import { WORKSHOP_DETAILS } from '../data/mockData';

interface InvoiceGeneratorProps {
  jobCard: JobCard;
  onClose: () => void;
  onUpdatePayment: (jobCardId: string, status: PaymentStatus, method: PaymentMethod) => void;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  jobCard,
  onClose,
  onUpdatePayment,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*ANNAM MOTORS - SERVICE INVOICE* 🏍️
📍 Kottar, Nagercoil (Helpline: 9842178450)

Dear *${jobCard.customerName}*,
Your vehicle *${jobCard.vehicleNumber}* (${jobCard.vehicleModel}) service is ready!

📋 *Job Card:* ${jobCard.id}
🔧 *Service:* ${jobCard.servicePackage}
⚙️ *Parts Cost:* ₹${jobCard.partsCost}
🛠️ *Labor Cost:* ₹${jobCard.laborCost}
💰 *Total Amount:* ₹${jobCard.totalAmount}
📊 *Payment Status:* ${jobCard.paymentStatus}

💳 *Pay via UPI (GPay/PhonePe):* ${WORKSHOP_DETAILS.upiId}

Thank you for choosing Annam Motors Kottar! Have a safe ride!`;

    const encoded = encodeURIComponent(text);
    const cleanPhone = jobCard.customerPhone.replace(/[^0-9]/g, '');
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${phoneWithCode}?text=${encoded}`, '_blank');
  };

  const laborItems = jobCard.items.filter(i => i.isLabor);
  const partItems = jobCard.items.filter(i => !i.isLabor);

  const subtotalBeforeTax = (jobCard.laborCost + jobCard.partsCost) - jobCard.discount;
  const halfGstRate = jobCard.gstRate / 2;
  const cgstAmount = Math.round(subtotalBeforeTax * (halfGstRate / 100));
  const sgstAmount = Math.round(subtotalBeforeTax * (halfGstRate / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col text-slate-100 max-h-[94vh]">
        {/* Modal Controls Header (Hidden during Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-white font-display">
              GST Tax Invoice & Service Receipt
            </h2>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
              {jobCard.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition"
              title="Share Bill on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Bill</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white text-slate-900 print-container flex-1">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-4">
            <div className="flex items-start gap-3">
              <img 
                src="/assets/logo.jpg" 
                alt="Annam Motors" 
                className="w-16 h-16 rounded-full border border-slate-800 object-cover" 
              />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 font-display">
                  ANNAM MOTORS
                </h1>
                <p className="text-xs font-bold text-amber-700 tracking-wide uppercase">
                  Two-Wheeler Multi-Brand Service Specialist
                </p>
                <p className="text-xs text-slate-600 mt-1 max-w-sm">
                  {WORKSHOP_DETAILS.address}
                </p>
                <p className="text-xs text-slate-600">
                  Landmark: {WORKSHOP_DETAILS.landmark}
                </p>
                <p className="text-xs text-slate-800 font-medium">
                  Helpline: {WORKSHOP_DETAILS.phones.join(' | ')}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-700 space-y-1">
              <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded font-bold uppercase tracking-wider text-xs mb-1">
                TAX INVOICE / BILL OF SUPPLY
              </div>
              <p><span className="font-semibold">Invoice No:</span> INV-{jobCard.id.replace('JC-', '')}</p>
              <p><span className="font-semibold">Date:</span> {new Date(jobCard.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p><span className="font-semibold">GSTIN:</span> {WORKSHOP_DETAILS.gstin}</p>
              <p><span className="font-semibold">State Code:</span> 33 (Tamil Nadu)</p>
            </div>
          </div>

          {/* Customer & Bike Info Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                Customer Details (Billed To)
              </span>
              <p className="font-semibold text-sm text-slate-900">{jobCard.customerName}</p>
              <p className="text-slate-600">Phone: <span className="font-medium text-slate-900">{jobCard.customerPhone}</span></p>
              <p className="text-slate-600">Address: {jobCard.customerAddress}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                Vehicle Particulars
              </span>
              <p className="font-mono font-bold text-sm text-amber-700">{jobCard.vehicleNumber}</p>
              <p className="text-slate-700 font-medium">{jobCard.vehicleBrand} - {jobCard.vehicleModel} ({jobCard.vehicleYear})</p>
              <p className="text-slate-600">Odometer: <span className="font-semibold">{jobCard.odometerKm.toLocaleString()} KM</span> | Fuel: {jobCard.fuelLevel}</p>
              <p className="text-slate-600">Mechanic: <span className="font-medium">{jobCard.assignedMechanicName}</span></p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Description of Goods / Services</th>
                  <th className="py-2 px-3 text-center">HSN / SAC</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Rate (₹)</th>
                  <th className="py-2 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {/* Labor Charges */}
                {laborItems.map((item, idx) => (
                  <tr key={item.id} className="bg-slate-50/50">
                    <td className="py-2 px-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">
                      {item.name} <span className="text-[10px] text-blue-700 font-semibold">(Service)</span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-500 font-mono">998714</td>
                    <td className="py-2 px-3 text-center">{item.quantity}</td>
                    <td className="py-2 px-3 text-right">₹{item.unitPrice}</td>
                    <td className="py-2 px-3 text-right font-semibold">₹{item.total}</td>
                  </tr>
                ))}

                {/* Spare Parts */}
                {partItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3 font-mono text-slate-500">{laborItems.length + idx + 1}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-2 px-3 text-center text-slate-500 font-mono">871410</td>
                    <td className="py-2 px-3 text-center">{item.quantity}</td>
                    <td className="py-2 px-3 text-right">₹{item.unitPrice}</td>
                    <td className="py-2 px-3 text-right font-semibold">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Calculation Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-4 border-t-2 border-slate-900 text-xs">
            {/* Payment Info & UPI QR */}
            <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <img 
                src={WORKSHOP_DETAILS.upiQrUrl} 
                alt="UPI QR Code" 
                className="w-24 h-24 border border-slate-300 rounded-lg p-1 bg-white" 
              />
              <div className="space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <QrCode className="w-4 h-4 text-amber-600" /> Scan to Pay via GPay / UPI
                </span>
                <p className="font-mono text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                  {WORKSHOP_DETAILS.upiId}
                </p>
                <div className="text-[11px] text-slate-600 pt-1">
                  Payment Status: <span className={`font-bold ${jobCard.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{jobCard.paymentStatus}</span>
                  {jobCard.paymentStatus === 'Paid' && ` (${jobCard.paymentMethod})`}
                </div>
              </div>
            </div>

            {/* Calculations Table */}
            <div className="space-y-1.5 text-right">
              <div className="flex justify-between py-0.5 text-slate-600">
                <span>Labor Charges:</span>
                <span className="font-medium text-slate-900">₹{jobCard.laborCost}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-600">
                <span>Spare Parts Total:</span>
                <span className="font-medium text-slate-900">₹{jobCard.partsCost}</span>
              </div>
              {jobCard.discount > 0 && (
                <div className="flex justify-between py-0.5 text-emerald-600">
                  <span>Special Discount:</span>
                  <span className="font-semibold">- ₹{jobCard.discount}</span>
                </div>
              )}
              {jobCard.gstRate > 0 && (
                <>
                  <div className="flex justify-between py-0.5 text-slate-600">
                    <span>CGST ({halfGstRate}%):</span>
                    <span className="font-medium text-slate-900">₹{cgstAmount}</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-slate-600">
                    <span>SGST ({halfGstRate}%):</span>
                    <span className="font-medium text-slate-900">₹{sgstAmount}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-base font-black text-slate-900 font-display">
                <span>Grand Total:</span>
                <span className="text-amber-700">₹{jobCard.totalAmount}</span>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                Amount in Words: {numberToWords(jobCard.totalAmount)} Rupees Only
              </p>
            </div>
          </div>

          {/* Terms & Signatures */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-600">
            <div>
              <p className="font-bold text-slate-800 uppercase mb-1">Terms & Conditions:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Goods once sold will not be taken back or exchanged.</li>
                <li>15 days service guarantee for general maintenance & tuning.</li>
                <li>Vehicles not collected within 7 days will incur parking fees.</li>
              </ul>
            </div>
            <div className="text-right flex flex-col justify-between items-end">
              <p className="font-bold text-slate-900">For ANNAM MOTORS (Kottar)</p>
              <div className="pt-8">
                <span className="border-t border-slate-400 px-6 font-medium text-slate-800">
                  Authorized Signatory / Service Advisor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Payment Status Quick Toggles (No Print) */}
        <div className="no-print bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Update Payment Status:</span>
            <button
              onClick={() => onUpdatePayment(jobCard.id, 'Paid', 'GPay / UPI')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition"
            >
              Mark Paid (UPI/GPay)
            </button>
            <button
              onClick={() => onUpdatePayment(jobCard.id, 'Paid', 'Cash')}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 transition"
            >
              Mark Paid (Cash)
            </button>
            <button
              onClick={() => onUpdatePayment(jobCard.id, 'Pending', 'Cash')}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              Mark Pending
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper for Indian Rupees word converter
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    return n.toString();
  };

  return inWords(num);
}
