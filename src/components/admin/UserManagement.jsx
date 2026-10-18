import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Users,
  Search,
  UserCheck,
  Shield,
  GraduationCap,
  Trash2,
  Edit3,
  Check,
  X,
  Mail,
  MoreVertical
} from 'lucide-react';

export const UserManagement = () => {
  const { users, currentUser, updateUserRole, deleteUser, approveUser, addToast } = useLMS();
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('student');

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department?.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleStartEdit = (user) => {
    setEditingUserId(user.id);
    setSelectedRole(user.role);
  };

  const handleSaveRole = (userId) => {
    updateUserRole(userId, selectedRole);
    setEditingUserId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            Access Governance
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            User Accounts & Roles
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Manage user credentials, permissions, and administrative roles across CacheUp
          </p>
        </div>

        {/* Role Filters */}
        <div className="flex items-center bg-cream/70 rounded-full p-1 border border-charcoal/10 overflow-x-auto">
          {['all', 'student', 'teacher', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                roleFilter === r
                  ? 'bg-charcoal text-cream shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {r === 'all' ? 'All Roles' : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name, email, or department..."
          className="w-full bg-white border border-charcoal/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal-muted uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-bold">User</th>
                <th className="pb-3 font-bold">Role</th>
                <th className="pb-3 font-bold">Department</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Joined</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {filteredUsers.map((u) => {
                const isEditing = editingUserId === u.id;
                const isSelf = currentUser?.id === u.id;

                return (
                  <tr key={u.id} className="hover:bg-cream/30 transition-colors">
                    {/* User info */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-charcoal/10"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-charcoal">
                              {u.name}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] bg-forest/10 text-forest font-semibold px-1.5 py-0.2 rounded-md">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-charcoal-muted">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="bg-cream border border-charcoal/20 rounded-lg px-2 py-1 text-xs text-charcoal focus:outline-none"
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleSaveRole(u.id)}
                            className="p-1 rounded bg-forest text-white hover:bg-forest-light"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="p-1 rounded bg-charcoal/10 text-charcoal hover:bg-charcoal/20"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                            u.role === 'admin'
                              ? 'bg-charcoal text-cream'
                              : u.role === 'teacher'
                              ? 'bg-forest text-cream'
                              : 'bg-sage/30 text-forest'
                          }`}
                        >
                          {u.role}
                        </span>
                      )}
                    </td>

                    {/* Department */}
                    <td className="py-3.5 text-charcoal-muted max-w-xs truncate">
                      {u.department || 'General Academy'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 text-charcoal-muted">
                      {u.joinedDate || '2026'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.status === 'pending' && (
                          <button
                            onClick={() => approveUser(u.id)}
                            className="px-2.5 py-1 rounded-lg bg-forest text-cream text-[11px] font-bold hover:bg-forest-light"
                          >
                            Approve
                          </button>
                        )}
                        {!isEditing && (
                          <button
                            onClick={() => handleStartEdit(u)}
                            className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-cream transition-colors"
                            title="Edit Role"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {!isSelf && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${u.name}?`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-charcoal-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
