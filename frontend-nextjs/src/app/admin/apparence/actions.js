'use server';
import { updateTag } from 'next/cache';


export async function refreshTheme() {
  updateTag('theme');
}
