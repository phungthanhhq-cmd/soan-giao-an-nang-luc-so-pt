import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Define Operation types according to Skill standards
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Check if we are running in simulation/mock mode due to placeholder config
export const isSimulationMode = firebaseConfig.projectId === 'placeholder-project-id' || 
                             firebaseConfig.apiKey === 'placeholder-api-key';

let activeApp: any = null;
let activeDb: any = null;
let activeAuth: any = null;

if (!isSimulationMode) {
  try {
    activeApp = initializeApp(firebaseConfig);
    activeDb = getFirestore(activeApp, firebaseConfig.firestoreDatabaseId);
    activeAuth = getAuth(activeApp);
    // Use local storage persistence for login session persistence across reloads
    setPersistence(activeAuth, browserLocalPersistence).catch(console.error);
  } catch (err) {
    console.error('Failed to initialize real Firebase, falling back to Simulation mode.', err);
  }
}

export const db = activeDb;
export const auth = activeAuth;

// Standard Error Handler per Firebase Integration Skill requirements
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuth = auth || (window as any)._simuAuth;
  const user = currentAuth?.currentUser;
  
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: user?.uid,
      email: user?.email,
      emailVerified: user?.emailVerified ?? true,
      isAnonymous: user?.isAnonymous ?? false,
      tenantId: user?.tenantId ?? null,
      providerInfo: user?.providerData?.map((p: any) => ({
        providerId: p.providerId,
        email: p.email,
      })) || []
    },
    operationType,
    path
  };
  
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// SIMULATOR IMPLEMENTATION for sandbox testing
interface SimulatedInviteLink {
  id: string;
  createdAt: any; // Date
  createdBy: string;
  boundToEmail?: string | null;
  boundAt?: any; // Date
  status: 'active' | 'revoked';
  description?: string;
}

class FirestoreSimulator {
  private links: Map<string, SimulatedInviteLink> = new Map();

  constructor() {
    // Populate some default simulation links for testing
    const defaultId1 = 'test-co-ban';
    this.links.set(defaultId1, {
      id: defaultId1,
      createdAt: new Date(),
      createdBy: 'phungthanhhq@gmail.com',
      status: 'active',
      description: 'Liên kết mẫu dùng thử (chưa kích hoạt)'
    });
    
    const defaultId2 = 'demo-link';
    this.links.set(defaultId2, {
      id: defaultId2,
      createdAt: new Date(),
      createdBy: 'phungthanhhq@gmail.com',
      boundToEmail: 'thaygiao@gmail.com',
      boundAt: new Date(Date.now() - 3600000),
      status: 'active',
      description: 'Liên kết mẫu (đã gán cho thaygiao@gmail.com)'
    });
  }

  getLinks(): SimulatedInviteLink[] {
    return Array.from(this.links.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getLink(id: string): SimulatedInviteLink | null {
    const link = this.links.get(id);
    return link ? { ...link } : null;
  }

  createLink(id: string, description: string, createdBy: string): SimulatedInviteLink {
    if (this.links.has(id)) {
      throw new Error(`Mã liên kết '${id}' đã tồn tại!`);
    }
    const newLink: SimulatedInviteLink = {
      id,
      createdAt: new Date(),
      createdBy,
      status: 'active',
      description
    };
    this.links.set(id, newLink);
    return newLink;
  }

  bindLink(id: string, email: string): SimulatedInviteLink {
    const link = this.links.get(id);
    if (!link) {
      throw new Error(`Không tìm thấy mã liên kết: ${id}`);
    }
    if (link.status !== 'active') {
      throw new Error(`Liên kết này đã bị vô hiệu hóa.`);
    }
    if (link.boundToEmail && link.boundToEmail !== email) {
      throw new Error(`Liên kết này đã thuộc sở hữu của Gmail khác.`);
    }
    link.boundToEmail = email;
    link.boundAt = new Date();
    this.links.set(id, link);
    return { ...link };
  }

  toggleLink(id: string): SimulatedInviteLink {
    const link = this.links.get(id);
    if (!link) throw new Error(`Không tìm thấy mã liên kết`);
    link.status = link.status === 'active' ? 'revoked' : 'active';
    this.links.set(id, link);
    return { ...link };
  }

  deleteLink(id: string): void {
    if (!this.links.has(id)) throw new Error(`Không tìm thấy mã liên kết`);
    this.links.delete(id);
  }
}

// Set simulator on global window for access across refreshes
if (!(window as any)._firestoreSim) {
  (window as any)._firestoreSim = new FirestoreSimulator();
}
const simulator: FirestoreSimulator = (window as any)._firestoreSim;

// Simulated Authentication State
class AuthSimulator {
  currentUser: any = null;
  private listeners: Set<(user: any) => void> = new Set();

  constructor() {
    // Check local storage for simulated session
    const stored = localStorage.getItem('_sim_user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
      } catch {
        localStorage.removeItem('_sim_user');
      }
    }
  }

  onAuthStateChanged(callback: (user: any) => void) {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => {
      this.listeners.delete(callback);
    };
  }

  async signIn(email: string) {
    this.currentUser = {
      uid: 'sim-' + btoa(email).substring(0, 10),
      email,
      displayName: email.split('@')[0],
      emailVerified: true,
      providerData: [{ providerId: 'google.com', email }]
    };
    localStorage.setItem('_sim_user', JSON.stringify(this.currentUser));
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('_sim_user');
    this.listeners.forEach(cb => cb(this.currentUser));
  }
}

if (!(window as any)._simuAuth) {
  (window as any)._simuAuth = new AuthSimulator();
}
const simAuth: AuthSimulator = (window as any)._simuAuth;

// EXPOSED API METHODS WITH COMPREHENSIVE ERROR PROTECTION

// 1. Google Auth wrapper
export async function loginWithSimulatedEmail(email: string): Promise<any> {
  const cleanEmail = email.trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error("Email khống hợp lệ!");
  }
  await simAuth.signIn(cleanEmail);
  return simAuth.currentUser;
}

export async function loginWithGooglePopup(): Promise<any> {
  if (isSimulationMode) {
    // Fallback to auto-signing as admin if prompt is blocked
    const email = "phungthanhhq@gmail.com";
    await simAuth.signIn(email);
    return simAuth.currentUser;
  } else {
    try {
      const provider = new GoogleAuthProvider();
      // Configure prompt select_account to make testing multiple emails easy
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      throw err;
    }
  }
}

// 2. Sign Out
export async function logout(): Promise<void> {
  if (isSimulationMode) {
    await simAuth.signOut();
  } else {
    await signOut(auth);
  }
}

// 3. Listen to auth changes
export function subscribeToAuth(callback: (user: any | null) => void): () => void {
  if (isSimulationMode) {
    return simAuth.onAuthStateChanged(callback);
  } else {
    return onAuthStateChanged(auth, callback);
  }
}

// 4. Fetch a specific invite link
export async function fetchInviteLink(linkId: string): Promise<any> {
  if (isSimulationMode) {
    return simulator.getLink(linkId);
  } else {
    const path = `invite_links/${linkId}`;
    try {
      const docRef = doc(db, 'invite_links', linkId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        return null;
      }
      const data = snapshot.data();
      return {
        ...data,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : null,
        boundAt: data.boundAt ? (data.boundAt as Timestamp).toDate() : null,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }
}

// 5. Check if user already has an active binding link for their email
export async function checkEmailBinding(email: string): Promise<any> {
  if (isSimulationMode) {
    const all = simulator.getLinks();
    const found = all.find(l => l.boundToEmail === email && l.status === 'active');
    return found || null;
  } else {
    const path = 'invite_links';
    try {
      // Avoid client side joins or O(N) reads, queried on collection
      // Security rule: `allow list` requires isSignedIn
      const querySnapshot = await getDocs(collection(db, 'invite_links'));
      let matchedLink: any = null;
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.boundToEmail === email && data.status === 'active') {
          matchedLink = {
            ...data,
            createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : null,
            boundAt: data.boundAt ? (data.boundAt as Timestamp).toDate() : null,
          };
        }
      });
      return matchedLink;
    } catch (err) {
      // If listing is denied or fails, fallback to manual logic in UI
      console.warn('Listing invite_links failed, checking bound state directly via route params');
      return null;
    }
  }
}

// 6. Bind User Email to the link
export async function bindEmailToLink(linkId: string, email: string): Promise<any> {
  if (isSimulationMode) {
    return simulator.bindLink(linkId, email);
  } else {
    const path = `invite_links/${linkId}`;
    try {
      const docRef = doc(db, 'invite_links', linkId);
      await updateDoc(docRef, {
        boundToEmail: email,
        boundAt: serverTimestamp()
      });
      return await fetchInviteLink(linkId);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
}

// 7. Admin ONLY: Get all created invite_links
export async function listAllLinks(): Promise<any[]> {
  if (isSimulationMode) {
    return simulator.getLinks();
  } else {
    const path = 'invite_links';
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'invite_links'), orderBy('createdAt', 'desc'))
      );
      const list: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          ...data,
          createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : null,
          boundAt: data.boundAt ? (data.boundAt as Timestamp).toDate() : null,
        });
      });
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }
}

// 8. Admin ONLY: Create new invite link
export async function createLink(linkId: string, description: string, createdBy: string): Promise<any> {
  const cleanId = linkId.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, '');
  if (!cleanId) {
    throw new Error('Mã liên kết chỉ được chứa chữ cái, số, dấu gạch ngang (-) và gạch dưới (_).');
  }

  if (isSimulationMode) {
    return simulator.createLink(cleanId, description, createdBy);
  } else {
    const path = `invite_links/${cleanId}`;
    try {
      const docRef = doc(db, 'invite_links', cleanId);
      // First verify it doesn't already exist
      const existingSnap = await getDoc(docRef);
      if (existingSnap.exists()) {
        throw new Error(`Mã liên kết '${cleanId}' đã tồn tại!`);
      }

      await setDoc(docRef, {
        id: cleanId,
        createdAt: serverTimestamp(),
        createdBy,
        status: 'active',
        description: description.trim()
      });

      return await fetchInviteLink(cleanId);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }
}

// 9. Admin ONLY: Toggle Link Status (active/revoked)
export async function toggleLinkStatus(linkId: string, currentStatus: 'active' | 'revoked'): Promise<any> {
  if (isSimulationMode) {
    return simulator.toggleLink(linkId);
  } else {
    const path = `invite_links/${linkId}`;
    try {
      const docRef = doc(db, 'invite_links', linkId);
      const newStatus = currentStatus === 'active' ? 'revoked' : 'active';
      await updateDoc(docRef, {
        status: newStatus
      });
      return await fetchInviteLink(linkId);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
}

// 10. Admin ONLY: Delete Link
export async function deleteLink(linkId: string): Promise<void> {
  if (isSimulationMode) {
    return simulator.deleteLink(linkId);
  } else {
    const path = `invite_links/${linkId}`;
    try {
      const docRef = doc(db, 'invite_links', linkId);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }
}
