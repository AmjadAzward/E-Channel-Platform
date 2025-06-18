// src/components/DeleteDoctor.js

import React from 'react';
import { deleteDoctor } from '../api';

const DeleteDoctor = ({ id }) => {
  const handleDelete = async () => {
    const result = await deleteDoctor(id);
    if (result) {
      alert(result);
    } else {
      alert('Failed to delete doctor');
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteDoctor;
