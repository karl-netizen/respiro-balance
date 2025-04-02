
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Lock, Users, Eye, EyeOff, AlertTriangle, CheckCircle, FileText, User, UserCheck } from "lucide-react";

const SecurityTab = () => {
  const [dataVisibility, setDataVisibility] = useState("team");
  const [biometricAccess, setBiometricAccess] = useState(true);
  const [anonymizedReporting, setAnonymizedReporting] = useState(false);
  const [dataRetention, setDataRetention] = useState("90days");
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Security Settings Saved",
      description: "Your data security settings have been updated.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Security</CardTitle>
          <CardDescription>
            Manage data access, visibility, and security settings for your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base font-semibold">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Data Access Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Client Biometric Data Access</div>
                        <div className="text-xs text-muted-foreground">Allow coaches to view client biometric data</div>
                      </div>
                      <Switch 
                        checked={biometricAccess} 
                        onCheckedChange={setBiometricAccess} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Anonymized Reporting</div>
                        <div className="text-xs text-muted-foreground">Generate reports with anonymized client data</div>
                      </div>
                      <Switch 
                        checked={anonymizedReporting} 
                        onCheckedChange={setAnonymizedReporting} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Visibility</label>
                      <Select value={dataVisibility} onValueChange={setDataVisibility}>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Data visibility level" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">Self-only (Clients see only their data)</SelectItem>
                          <SelectItem value="team">Team (Coaches see assigned clients)</SelectItem>
                          <SelectItem value="department">Department (Coaches see department data)</SelectItem>
                          <SelectItem value="organization">Organization (All client data visible)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Retention Period</label>
                      <Select value={dataRetention} onValueChange={setDataRetention}>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <Lock className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Data retention period" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30days">30 days</SelectItem>
                          <SelectItem value="90days">90 days</SelectItem>
                          <SelectItem value="1year">1 year</SelectItem>
                          <SelectItem value="3years">3 years</SelectItem>
                          <SelectItem value="indefinite">Indefinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base font-semibold">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Team Access Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Role</TableHead>
                          <TableHead>Clients</TableHead>
                          <TableHead>Biometrics</TableHead>
                          <TableHead>Reports</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Admin</TableCell>
                          <TableCell><CheckCircle className="h-4 w-4 text-green-500" /></TableCell>
                          <TableCell><CheckCircle className="h-4 w-4 text-green-500" /></TableCell>
                          <TableCell><CheckCircle className="h-4 w-4 text-green-500" /></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Coach</TableCell>
                          <TableCell><CheckCircle className="h-4 w-4 text-green-500" /></TableCell>
                          <TableCell>{biometricAccess ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />}</TableCell>
                          <TableCell><CheckCircle className="h-4 w-4 text-green-500" /></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Assistant</TableCell>
                          <TableCell><CheckCircle className="h-4 w-4 text-green-500" /></TableCell>
                          <TableCell><EyeOff className="h-4 w-4 text-gray-400" /></TableCell>
                          <TableCell>{anonymizedReporting ? <CheckCircle className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Client</TableCell>
                          <TableCell><User className="h-4 w-4 text-gray-400" /></TableCell>
                          <TableCell><User className="h-4 w-4 text-gray-400" /></TableCell>
                          <TableCell><User className="h-4 w-4 text-gray-400" /></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base font-semibold">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Privacy & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md space-y-3">
                    <h4 className="text-sm font-medium">Data Protection Policy</h4>
                    <p className="text-xs text-muted-foreground">
                      Defines how client data is stored, processed, and protected.
                    </p>
                    <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">View Policy</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Data Protection Policy</DialogTitle>
                          <DialogDescription>
                            Guidelines for handling sensitive client information
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 my-4 text-sm">
                          <p>This policy outlines how client biometric and meditation data is collected, stored, processed, and protected.</p>
                          <div className="space-y-2">
                            <h4 className="font-medium">Key Points:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>All data is encrypted in transit and at rest</li>
                              <li>Biometric data is stored separately from identifiable information</li>
                              <li>Clients can request data deletion at any time</li>
                              <li>Regular security audits are performed</li>
                              <li>Data is only shared with explicit consent</li>
                            </ul>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => setShowPolicyDialog(false)}>Close</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="p-4 border rounded-md space-y-3">
                    <h4 className="text-sm font-medium">Consent Management</h4>
                    <p className="text-xs text-muted-foreground">
                      Manage consent forms and client permissions for data usage.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">Manage Consent</Button>
                  </div>
                  
                  <div className="p-4 border rounded-md space-y-3">
                    <h4 className="text-sm font-medium">Compliance Status</h4>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                      <span className="text-xs font-medium text-green-600">All requirements met</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current configuration meets HIPAA and GDPR requirements.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Reset to Defaults</Button>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </CardFooter>
      </Card>
      
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Enterprise Security Note</h3>
              <p className="text-xs text-yellow-700 mt-1">
                Enterprise users have access to additional security features including role-based access control, 
                audit logging, single sign-on (SSO), and custom data retention policies. Contact your account 
                manager to enable these features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTab;
