import React from 'react';
import { useSupportUserMutation } from '../slices/usersApiSlice';


const SupportButton = () => {
  const [supportUser] = useSupportUserMutation();

  const handleClick = async () => {
    try {
      const result = await supportUser().unwrap();

      if (!result?.supportToken) {
        console.error('No support token received:', result);
        return;
      }



      const supportURL = `http://localhost:3001?token=${result.supportToken}`;
      window.open(supportURL, '_blank');
    } catch (err) {
      console.error('Failed to get support token:', err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-gray-800 hover:text-gray-600 text-lg transition duration-300"
    >
      Support
    </button>
  );
};

export default SupportButton;