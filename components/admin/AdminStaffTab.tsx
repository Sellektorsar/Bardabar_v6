"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import type React from "react";

import type { TeamMember } from "../../src/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface AdminStaffTabProps {
  teamMembers: TeamMember[];
  newTeamMember: Omit<TeamMember, "id">;
  editingTeamMember: TeamMember | null;
  onNewTeamMemberChange: (member: Omit<TeamMember, "id">) => void;
  onEditingTeamMemberChange: (member: TeamMember | null) => void;
  onAddTeamMember: () => void;
  onUpdateTeamMember: () => void;
  onDeleteTeamMember: (id: number) => void;
}

export function AdminStaffTab({
  teamMembers,
  newTeamMember,
  editingTeamMember,
  onNewTeamMemberChange,
  onEditingTeamMemberChange,
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
}: AdminStaffTabProps) {
  const handleInputChange = (field: keyof Omit<TeamMember, "id">, value: string) => {
    onNewTeamMemberChange({ ...newTeamMember, [field]: value });
  };

  const handleEditInputChange = (field: keyof TeamMember, value: string) => {
    if (editingTeamMember) {
      onEditingTeamMemberChange({ ...editingTeamMember, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Добавить сотрудника
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="staff-name">Имя</Label>
              <Input
                id="staff-name"
                value={newTeamMember.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("name", e.target.value)
                }
                placeholder="Введите имя сотрудника"
              />
            </div>
            <div>
              <Label htmlFor="staff-position">Должность</Label>
              <Input
                id="staff-position"
                value={newTeamMember.position}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("position", e.target.value)
                }
                placeholder="Введите должность"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="staff-speciality">Специализация</Label>
            <Input
              id="staff-speciality"
              value={newTeamMember.speciality}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("speciality", e.target.value)
              }
              placeholder="Введите специализацию"
            />
          </div>
          <div>
            <Label htmlFor="staff-image">URL изображения</Label>
            <Input
              id="staff-image"
              value={newTeamMember.image}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("image", e.target.value)
              }
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <div>
            <Label htmlFor="staff-description">Описание</Label>
            <Textarea
              id="staff-description"
              value={newTeamMember.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("description", e.target.value)
              }
              placeholder="Краткое описание сотрудника"
              rows={3}
            />
          </div>
          <Button onClick={onAddTeamMember} className="w-full">
            Добавить сотрудника
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список сотрудников</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={member.image || "https://via.placeholder.com/60"}
                  alt={member.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <Badge variant="secondary">{member.position}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditingTeamMemberChange(member)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteTeamMember(member.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {editingTeamMember && (
        <Card>
          <CardHeader>
            <CardTitle>Редактировать сотрудника</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Имя</Label>
                <Input
                  value={editingTeamMember.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleEditInputChange("name", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Должность</Label>
                <Input
                  value={editingTeamMember.position}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleEditInputChange("position", e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <Label>Специализация</Label>
              <Input
                value={editingTeamMember.speciality}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleEditInputChange("speciality", e.target.value)
                }
              />
            </div>
            <div>
              <Label>URL изображения</Label>
              <Input
                value={editingTeamMember.image}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleEditInputChange("image", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea
                value={editingTeamMember.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleEditInputChange("description", e.target.value)
                }
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={onUpdateTeamMember}>Сохранить изменения</Button>
              <Button variant="outline" onClick={() => onEditingTeamMemberChange(null)}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
