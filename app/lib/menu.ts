import { db } from "~/firebase";
import { DATE_TIME_FORMAT, formatDateTime } from "./datetime";
import { deleteDoc, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import type { MenuByDate } from "~/types/data";

export const getMenuByDate = async (date: Date) => {
  const path = `${formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE)}`;
  const docRef = doc(db, "menus", path);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  return docSnap.data() as unknown as MenuByDate;
};

export const createMenuByDate = async (date: Date) => {
  const path = formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE);
  const docRef = doc(db, "menus", path);
  await setDoc(docRef, {
    dateString: path,
    date: Timestamp.fromDate(date),
    chatMessages: [],
  });
  const docSnap = await getDoc(docRef);
  return docSnap.data() as unknown as MenuByDate;
};

export const updateMenuByDate = async (
  date: Date,
  data: Partial<MenuByDate>
) => {
  const path = formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE);
  const docRef = doc(db, "menus", path);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await setDoc(docRef, {
      ...docSnap.data(),
      ...data,
    });
  }
};

export const deleteMenuByDate = async (date: Date) => {
  const path = formatDateTime(date, DATE_TIME_FORMAT.ISO_DATE);
  const docRef = doc(db, "menus", path);
  await deleteDoc(docRef);
};
