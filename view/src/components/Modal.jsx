/* eslint-disable react/prop-types */
const Modal = ({ isModalOpen, handleConfirmLogout, closeModal }) => {
  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  return (
    <div
      style={{ display: isModalOpen ? "block" : "none" }}
      className="flex flex-col justify-center items-center h-screen bg-gray-100"
    >
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-gray-50 backdrop-blur-sm bg-opacity-80 flex justify-center items-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 transform transition-transform duration-300 ease-in-out">
            <h1 className="text-lg font-semibold text-center mb-4">
              Logout Confirmation
            </h1>
            <p className="text-center mb-6">
              You are logging out. Is this what you want?
            </p>

            <div className="flex justify-around">
              <button
                onClick={handleConfirmLogout}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-200"
              >
                Confirm
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
