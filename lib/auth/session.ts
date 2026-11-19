import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

export type SessionUser = { id: string; email: string; fullName: string; role: 'customer'|'professional'|'admin' };
const COOKIE = 'miabe_session';
function secret() { const s=process.env.AUTH_SECRET; if(!s || s.length<32) throw new Error('AUTH_SECRET doit contenir au moins 32 caractères.'); return new TextEncoder().encode(s); }
export async function createSession(user: SessionUser) {
 const token=await new SignJWT(user).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').sign(secret());
 const jar=await cookies(); jar.set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*7});
}
export async function getSession(): Promise<SessionUser|null> {
 const token=(await cookies()).get(COOKIE)?.value; if(!token) return null;
 try { const {payload}=await jwtVerify(token,secret()); return {id:String(payload.id),email:String(payload.email),fullName:String(payload.fullName),role:payload.role as SessionUser['role']}; } catch { return null; }
}
export async function destroySession(){(await cookies()).delete(COOKIE)}
export async function requireUser(){const u=await getSession(); if(!u) throw new Error('AUTH_REQUIRED'); return u;}
export async function requireAdmin(){const u=await requireUser(); if(u.role!=='admin') throw new Error('FORBIDDEN'); return u;}
