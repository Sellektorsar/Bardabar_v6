import { create } from "zustand";
import type { TeamMember } from "../types";
import { defaultTeamMembers } from "../data/defaults";

interface TeamState {
  members: TeamMember[];
  editingMember: TeamMember | null;
  newMember: Omit<TeamMember, "id">;
  setMembers: (members: TeamMember[]) => void;
  setEditingMember: (member: TeamMember | null) => void;
  setNewMember: (member: Omit<TeamMember, "id">) => void;
  addMember: () => boolean;
  updateMember: () => boolean;
  deleteMember: (id: number) => void;
  resetNewMember: () => void;
}

const defaultNewMember: Omit<TeamMember, "id"> = {
  name: "",
  position: "",
  description: "",
  image: "",
  speciality: "",
};

export const useTeamStore = create<TeamState>((set, get) => ({
  members: defaultTeamMembers,
  editingMember: null,
  newMember: defaultNewMember,

  setMembers: (members) => set({ members }),
  setEditingMember: (member) => set({ editingMember: member }),
  setNewMember: (member) => set({ newMember: member }),

  addMember: () => {
    const { newMember, members } = get();
    if (!newMember.name || !newMember.position) return false;

    set({
      members: [...members, { ...newMember, id: Date.now() }],
      newMember: defaultNewMember,
    });
    return true;
  },

  updateMember: () => {
    const { editingMember, members } = get();
    if (!editingMember) return false;

    set({
      members: members.map((member) =>
        member.id === editingMember.id ? editingMember : member
      ),
      editingMember: null,
    });
    return true;
  },

  deleteMember: (id) => {
    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
    }));
  },

  resetNewMember: () => set({ newMember: defaultNewMember }),
}));
