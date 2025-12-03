import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserResponseData } from '../../../../models/users/user-response.interface';
import { UserRequest } from '../../../../models/users/user-request.interface';
import { UserRole } from '../../../../models/roles/user-role';
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  public UserRole = UserRole;

  users = signal<UserResponseData[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  editMode = signal<'create' | 'edit'>('create');
  editingUserId = signal<number | null>(null);

  // FORM COMPLETO LISTO PARA ENVIAR AL BACKEND
  userForm = this.fb.group({
    username: ['', Validators.required],
    firstname: ['', [Validators.required]],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],

    role: ['CLIENT', Validators.required],
    dni: [''],
    address: [''],
    phone: [''],

    position: [''],
    hireDate: [''],
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);

    this.userService.listUsers().subscribe({
      next: (resp) => {
        this.users.set(resp.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar usuarios');
        this.loading.set(false);
      }
    });
  }

  private cleanBody(body: any): any {
    const cleaned: any = {};
    Object.keys(body).forEach(k => {
      if (body[k] !== '' && body[k] !== null && body[k] !== undefined) {
        cleaned[k] = body[k];
      }
    });
    return cleaned;
  }

  createUser(): void {
    if (this.userForm.invalid) return;

    const raw = this.userForm.value;
    const body: UserRequest = this.cleanBody(raw) as UserRequest;

    this.userService.createUser(body).subscribe({
      next: (resp) => {
        this.users.update(list => [...list, resp.data!]);
        this.resetForm();
      },
      error: () => {
        this.error.set('Error al crear usuario');
      }
    });
  }

  startEdit(user: UserResponseData): void {
    this.editMode.set('edit');
    this.editingUserId.set(user.id);

    this.userForm.patchValue({
      username: user.username ?? '',
      firstname: user.firstname ?? '',
      lastname: user.lastname ?? '',
      email: user.email,
      password: '', // nunca se expone
      role: user.role,
      dni: user.dni ?? '',
      address: user.address ?? '',
      phone: user.phone ?? '',
      position: user.position ?? '',
      hireDate: user.hireDate ?? ''
    });

    // password no requerido al editar
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  updateUser(): void {
    if (!this.editingUserId()) return;

    const userId = this.editingUserId()!;
    const raw = this.userForm.value;

    // Si password está vacío → NO se envía
    if (!raw.password) delete raw.password;

    const body: UserRequest = this.cleanBody(raw) as UserRequest;

    this.userService.updateUser(userId, body).subscribe({
      next: (resp) => {
        this.users.update(list =>
          list.map(u => u.id === userId ? resp.data! : u)
        );
        this.resetForm();
      },
      error: () => this.error.set('Error al actualizar usuario')
    });
  }

  deleteUser(id: number): void {
    if (!confirm('¿Eliminar usuario?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.id !== id));
      },
      error: () => this.error.set('Error al eliminar usuario')
    });
  }

  resetForm(): void {
    this.editMode.set('create');
    this.editingUserId.set(null);

    this.userForm.reset({
      role: 'CLIENT'
    });

    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
  }
}
