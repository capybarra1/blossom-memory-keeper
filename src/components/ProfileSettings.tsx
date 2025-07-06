
import React from "react";
import { X, User, Settings, Bell, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import avartarImage from '/src/asset/renderings/avatar.png';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const settingsItems = [
    { icon: User, label: "Edit Profile", action: () => {} },
    { icon: Settings, label: "App Settings", action: () => {} },
    { icon: Bell, label: "Notifications", action: () => {} },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Profile Settings</h2>
          <button onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-plantDiary-lightGreen/30 to-white rounded-2xl">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img src={avartarImage} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Jane's Plant Diary</h3>
              <p className="text-sm text-gray-500">Plant collector since May 2023</p>
            </div>
          </div>

          <div className="space-y-2">
            {settingsItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <item.icon className="h-5 w-5 text-gray-600" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
