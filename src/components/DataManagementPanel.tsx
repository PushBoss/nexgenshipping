import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Upload, Download, Database, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { dataSync, getDataSource } from '../utils/dataSync';
import { Product } from './ProductCard';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';
import { config } from '../utils/config';

interface DataManagementPanelProps {
  products: Product[];
}

export function DataManagementPanel({ products }: DataManagementPanelProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const dataSource = getDataSource();

  const handleHealthCheck = async () => {
    setIsChecking(true);
    const result = await dataSync.checkSupabaseHealth();
    setHealthStatus(result);
    setIsChecking(false);
    
    if (result.available) {
      toast.success(`Supabase connected - ${result.productCount} products in database`);
    } else {
      toast.error(result.message);
    }
  };

  const handleMigrate = async () => {
    if (products.length === 0) {
      toast.error('No products to migrate');
      return;
    }

    const confirmed = window.confirm(
      `Migrate ${products.length} products to Supabase?\n\n` +
      `This will upload all current products to the cloud database.\n\n` +
      `Continue?`
    );

    if (!confirmed) return;

    setIsMigrating(true);
    const result = await dataSync.migrateToSupabase(products);
    setIsMigrating(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    const result = await dataSync.exportToCSV();
    setIsExporting(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  if (!config.useSupabase) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your product data</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-blue-50 border-blue-200">
            <Database className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Local Mode Active</strong>
              <p className="mt-2 text-sm">
                You're currently using local storage only. Data will be lost on page refresh.
                To enable persistent cloud storage, set <code className="bg-blue-100 px-1 rounded">useSupabase: true</code> in <code className="bg-blue-100 px-1 rounded">/utils/config.ts</code>
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Sync and manage your product data with Supabase</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            <Database className="h-3 w-3 mr-1" />
            Supabase Mode
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Status */}
        {healthStatus && (
          <Alert className={healthStatus.available ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
            {healthStatus.available ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <AlertDescription className={healthStatus.available ? "text-green-800" : "text-red-800"}>
              <strong>{healthStatus.message}</strong>
              {healthStatus.productCount !== undefined && (
                <p className="text-sm mt-1">Database contains {healthStatus.productCount} products</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Local Products</p>
                <p className="text-2xl font-bold text-[#003366]">{products.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Data Source</p>
                <Badge className="mt-1 bg-[#003366]">{dataSource}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleHealthCheck}
              disabled={isChecking}
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Check Connection
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </>
              )}
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
            onClick={handleMigrate}
            disabled={isMigrating || products.length === 0}
          >
            {isMigrating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Migrating...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Migrate {products.length} Products to Supabase
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Use "Migrate to Supabase" once to upload your current products to the cloud.
            After migration, all new products will automatically be saved to Supabase.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
