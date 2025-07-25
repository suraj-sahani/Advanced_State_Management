import { useActionState, useState } from 'react';
import { z } from 'zod';

const submitAction = async (formData: FormData) => {
  const firstName = formData.get('firstName');
  console.log(firstName);
};

function Form() {
  const [state, formAction, isPending] = useActionState(submitAction, null);

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <form action={formAction}>
      <input type="text" name="firstName" />
      <button type="submit">Submit</button>
    </form>
  );
}
