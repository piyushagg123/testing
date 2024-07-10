const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-prim p-5 rounded-md shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
        {children}
        <button
          className="border-text border-[2px] text-text bg-prim hover:bg-text hover:text-prim hover:border-text p-1 rounded-[5px]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
