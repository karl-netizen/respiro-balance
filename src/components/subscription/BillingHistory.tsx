
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Download, 
  CreditCard, 
  Check, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  invoiceUrl?: string;
  plan: string;
}

export const BillingHistory: React.FC = () => {
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock billing history data
    const mockHistory: BillingRecord[] = [
      {
        id: '1',
        date: '2024-01-15',
        amount: 11.97,
        status: 'paid',
        description: 'Premium Plan - Monthly',
        plan: 'Premium',
        invoiceUrl: '#'
      },
      {
        id: '2',
        date: '2023-12-15',
        amount: 11.97,
        status: 'paid',
        description: 'Premium Plan - Monthly',
        plan: 'Premium',
        invoiceUrl: '#'
      },
      {
        id: '3',
        date: '2023-11-15',
        amount: 11.97,
        status: 'paid',
        description: 'Premium Plan - Monthly',
        plan: 'Premium',
        invoiceUrl: '#'
      }
    ];

    setTimeout(() => {
      setBillingHistory(mockHistory);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadInvoice = (invoiceUrl: string) => {
    if (invoiceUrl && invoiceUrl !== '#') {
      window.open(invoiceUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-teal-600" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-teal-600" />
          Billing History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {billingHistory.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No billing history available</p>
            <p className="text-sm text-gray-500 mt-1">
              Your billing history will appear here after your first payment
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {billingHistory.map((record) => (
              <div 
                key={record.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{record.description}</p>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(record.date), 'MMM dd, yyyy')}
                      </span>
                      <span className="font-medium">${record.amount}</span>
                    </div>
                  </div>
                </div>
                
                {record.invoiceUrl && record.status === 'paid' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadInvoice(record.invoiceUrl!)}
                    className="text-teal-600 hover:text-teal-700"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Invoice
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillingHistory;
