const Message = ({ variant, children }) => (
    <div className={`p-4 rounded-lg ${variant === 'danger' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
      {children}
    </div>
  );
  
  export default Message;