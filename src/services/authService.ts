import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { auth } from '@/config/firebase';

export async function cadastrar(email: string, senha: string) {
  await createUserWithEmailAndPassword(auth, email.trim(), senha);
}

export async function entrar(email: string, senha: string) {
  await signInWithEmailAndPassword(auth, email.trim(), senha);
}

export async function sair() {
  await signOut(auth);
}

export async function recuperarSenha(email: string) {
  await sendPasswordResetEmail(auth, email.trim());
}
