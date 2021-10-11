const TypeInfo = Symbol("AWSType.TypeInfo");

export class AWSType {
  constructor(api, idkey, iddef) {
    this[TypeInfo] = {api, idkey};

    if (typeof iddef === "string") {
      this[idkey] = iddef;
      this[TypeInfo].state = "identified";
    } else if (iddef) {
      Object.assign(this, iddef);
      this[TypeInfo].state = "defined";
    } else {
      this[TypeInfo].state = "unidentified";
    }
  }

  static get TypeInfo() { return TypeInfo; }

  get api()   { return this[TypeInfo].api; }
  get id()    { return this[this.idkey]; }
  get idkey() { return this[TypeInfo].idkey; }
  get state() { return this[TypeInfo].state; }

  throwIfUndefined() {
    if (this.state !== "defined") {
      throw new Error("AWS object has not defined");
    }
  }

  throwIfUnidentified() {
    if (this.state === "unidentified") {
      throw new Error("AWS object has not been identified");
    }
  }
}

export class AWSTaggable {
  async tag(key, value) {
    await this.api.createTags({
      Resources: [this.id],
      Tags: [{Key: key, Value: value}]
    });
  }
}

export function mix(Class, Mixin) {
  for (const name of Object.getOwnPropertyNames(Mixin.prototype)) {
    if (!(name in Class.prototype)) {
      Class.prototype[name] = Mixin.prototype[name];
    }
  }

  return Class;
}
