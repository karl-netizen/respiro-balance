
import ProfileManagement from './sections/ProfileManagement';
import AccountStatusDashboard from './sections/AccountStatusDashboard';
import DataManagement from './sections/DataManagement';
import DangerZone from './sections/DangerZone';

const AccountGeneralSettings = () => {
  return (
    <div className="space-y-6">
      <ProfileManagement />
      <AccountStatusDashboard />
      <DataManagement />
      <DangerZone />
    </div>
  );
};

export default AccountGeneralSettings;
