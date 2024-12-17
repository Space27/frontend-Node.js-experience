import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormField} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'avatar-dialog',
  templateUrl: 'avatar.dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormField, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarDialogComponent {
  @Output() submit = new EventEmitter<File | null>();
  protected fileName = '';
  protected file: File | null;

  constructor() {
    this.file = null;
  }

  postImage() {
    this.submit.emit(this.file as File);
  }

  deleteImage() {
    this.submit.emit(null);
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.fileName = this.file.name;
    }
  }
}
