import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext(undefined);

export const ModalProvider = ({ children }) => {
  const [modal_content, setModalContent] = useState(null);

  const showModal = (content) => setModalContent(content);
  const hideModal = () => setModalContent(null);

  return (
    <ModalContext.Provider value={{ modal_content, showModal, hideModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);

export default ModalContext;
