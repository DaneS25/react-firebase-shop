import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};