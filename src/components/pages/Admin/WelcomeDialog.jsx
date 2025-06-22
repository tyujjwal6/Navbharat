import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import LetterHead from "./LetterHead";

const WelcomeDialog = ({ isOpen, user, onClose }) => {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-full bg-white h-full overflow-y-scroll ">
        <DialogHeader>
          <DialogTitle>Create Welcome Letter</DialogTitle>
          <DialogDescription>
            You are creating a welcome letter for User ID: {user?.id || ''}. 
            This letter will welcome the new member and provide important information.
          </DialogDescription>
        </DialogHeader>
        
      <LetterHead user={user} />
        
     
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;