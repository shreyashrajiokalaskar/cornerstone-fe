import { Directive, effect, TemplateRef, ViewContainerRef } from '@angular/core';
import { ROLES, SESSION_KEYS } from '../../constant/common.constant';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermission {
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {
    effect(() => {
      this.update();
    });
  }

  update() {
    const role = localStorage.getItem(SESSION_KEYS.ROLE);

    const isAdmin = role === ROLES.ADMIN;
    console.log('HasPermission check', role, isAdmin);
    this.viewContainer.clear();
    if (isAdmin) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
