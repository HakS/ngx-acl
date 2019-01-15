import { Injectable } from '@angular/core';

export interface Config {
  storage: StorageType;
  storageKey: string;
}

export interface Data {
  roles: string[];
  abilities: { [key: string]: string[] };
}

export enum StorageType {
  sessionStorage = 'sessionStorage',
  localStorage = 'localStorage'
}

@Injectable({
  providedIn: 'root'
})
export class NgxAclService {
  private config: Config = {
    storage: StorageType.localStorage,
    storageKey: 'AclService'
  };
  private data: Data = {
    roles: [],
    abilities: {}
  };

  public setConfig(userConfig: Config) {
    Object.assign(this.config, userConfig);
  }

  /**
   * Does current user have permission to do something?
   */
  public can(ability: string): boolean {
    let role: string;
    let abilities: string[];
    // Loop through roles
    for (let l = 0; l < this.data.roles.length; l++) {
      // Grab the the current role
      role = this.data.roles[l];
      abilities = this.getRoleAbilities(role);
      if (abilities.indexOf(ability) > -1) {
        // Ability is in role abilities
        return true;
      }
    }
    // We made it here, so the ability wasn't found in attached roles
    return false;
  }

  /**
   * Does current user have any of the required permission to do something?
   */
  public canAny(abilities: string[]): boolean {
    let role: string;
    let roleAbilities: string[];
    // Loop through roles

    for (let l = 0; l < this.data.roles.length; l++) {
      // Grab the the current role
      role = this.data.roles[l];
      roleAbilities = this.getRoleAbilities(role);

      for (let j = 0; j < abilities.length; j++) {
      // for (; j--;) {
        if (roleAbilities.indexOf(abilities[j]) > -1) {
          // Ability is in role abilities
          return true;
        }
      }
    }
    // We made it here, so the ability wasn't found in attached roles
    return false;
  }

  /**
   * Restore data from web storage.
   *
   * Returns true if web storage exists and false if it doesn't.
   */
  public resume(): boolean {
    let storedData: any;

    switch (this.config.storage) {
      case StorageType.sessionStorage:
        storedData = this.fetchFromStorage(StorageType.sessionStorage);
        break;
      case StorageType.localStorage:
        storedData = this.fetchFromStorage(StorageType.localStorage);
        break;
      default:
        storedData = null;
    }
    if (storedData) {
      Object.assign(this.data, storedData);
      return true;
    }

    return false;
  }

  /**
   * Set the abilities object (overwriting previous abilities)
   *
   * Each property on the abilities object should be a role.
   * Each role should have a value of an array. The array should contain
   * a list of all of the roles abilities.
   *
   * Example:
   *
   *    {
   *        guest: ['login'],
   *        user: ['logout', 'view_content'],
   *        admin: ['logout', 'view_content', 'manage_users']
   *    }
   *
   */
  public setAbilities(abilities: { [key: string]: string[] }) {
    this.data.abilities = abilities;
    this.save();
  }

  /**
   * Add an ability to a role
   */
  public addAbility(role: string, ability: string) {
    if (!this.data.abilities[role]) {
      this.data.abilities[role] = [];
    }
    this.data.abilities[role].push(ability);
    this.save();
  }

  /**
   * Remove data from web storage
   */
  public flushStorage() {
    this.unset();
  }

  /**
   * Attach a role to the current user
   */
  public attachRole(role: string) {
    if (this.data.roles.indexOf(role) === -1) {
      this.data.roles.push(role);
      this.save();
    }
  }

  /**
   * Remove role from current user
   */
  public detachRole(role: string) {
    const i = this.data.roles.indexOf(role);
    if (i > -1) {
      this.data.roles.splice(i, 1);
      this.save();
    }
  }

  /**
   * Remove all roles from current user
   */
  public flushRoles() {
    this.data.roles = [];
    this.save();
  }

  /**
   * Returns the current user roles
   */
  public getRoles(): any[] {
    return this.data.roles;
  }

  /**
   * Check if the current user has role(s) attached
   */
  public hasRole(role: string[] | string): boolean {
    const roles = Array.isArray(role) ? role : [role];
    for (let l = roles.length; l--;) {
      if (this.data.roles.indexOf(roles[l]) === -1) {
        return false;
      }
    }
    return !!roles.length;
  }

  /**
   * Check if the current user any of the given roles
   */
  public hasAnyRole(roles: string[]): boolean {
    for (let l = roles.length; l--;) {
      if (this.hasRole(roles[l])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Does the given role have abilities granted to it?
   *
   * @param role The role to ask for given abilities
   */
  private roleHasAbilities(role: string): boolean {
    return (typeof this.data.abilities[role] === 'object');
  }

  /**
   * Retrieve the abilities array for the given role
   *
   * @param role The role to fild its abilities
   */
  private getRoleAbilities(role: string): string[] {
    return (this.roleHasAbilities(role)) ? this.data.abilities[role] : [];
  }

  /**
   * Persist data to storage based on config
   */
  private save(): void {
    switch (this.config.storage) {
      case StorageType.sessionStorage:
        this.saveToStorage(StorageType.sessionStorage);
        break;
        case StorageType.localStorage:
        this.saveToStorage(StorageType.localStorage);
        break;
      default:
        // Don't save
        return;
    }
  }

  private unset() {
    switch (this.config.storage) {
      case StorageType.sessionStorage:
        this.unsetFromStorage(StorageType.sessionStorage);
        break;
      case StorageType.localStorage:
        this.unsetFromStorage(StorageType.localStorage);
        break;
      default:
        // Don't save
        return;
    }
  }

  /**
   * Persist data to web storage
   */
  private saveToStorage(storagetype: StorageType) {
    window[storagetype].setItem(this.config.storageKey, JSON.stringify(this.data));
  }

  /**
   * Unset data from web storage
   */
  private unsetFromStorage(storagetype: StorageType) {
    window[storagetype].removeItem(this.config.storageKey);
  }

  /**
   * Retrieve data from web storage
   */
  private fetchFromStorage(storagetype: StorageType) {
    const storageData = window[storagetype].getItem(this.config.storageKey);
    return (storageData) ? JSON.parse(storageData) : false;
  }
}
