
const DeviceSearching = () => {
  return (
    <div className="text-center py-4">
      <div className="flex justify-center mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
      <p className="text-sm mb-2">Searching for devices...</p>
      <p className="text-xs text-muted-foreground">
        Make sure your device is nearby and Bluetooth is enabled
      </p>
    </div>
  );
};

export default DeviceSearching;
