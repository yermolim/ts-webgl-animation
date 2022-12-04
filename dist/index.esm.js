function i(t,i){return Math.random()*(i-t)+t}function s(t){return t[Math.floor(Math.random()*t.length)]}function e(t){return t*Math.PI/180}function n(t,i,s){return Math.max(i,Math.min(t,s))}function y(t){return 0==(t&t-1)}class u{constructor(t=0,i=0){this.length=2,this.x=t,this.y=i;}static multiplyByScalar(t,i){return new u(t.x*i,t.y*i)}static addScalar(t,i){return new u(t.x+i,t.y+i)}static normalize(t){return (new u).setFromVec2(t).normalize()}static add(t,i){return new u(t.x+i.x,t.y+i.y)}static substract(t,i){return new u(t.x-i.x,t.y-i.y)}static dotProduct(t,i){return t.x*i.x+t.y*i.y}static applyMat3(t,i){return t.clone().applyMat3(i)}static lerp(t,i,s){return t.clone().lerp(i,s)}static rotate(t,i,s){return t.clone().rotate(i,s)}static equals(t,i,s=6){return !!t&&t.equals(i)}static getDistance(t,i){const s=i.x-t.x,r=i.y-t.y;return Math.sqrt(s*s+r*r)}static minMax(...t){return {min:new u(Math.min(...t.map((t=>t.x))),Math.min(...t.map((t=>t.y)))),max:new u(Math.max(...t.map((t=>t.x))),Math.max(...t.map((t=>t.y))))}}clone(){return new u(this.x,this.y)}set(t,i){return this.x=t,this.y=i,this}setFromVec2(t){return this.x=t.x,this.y=t.y,this}multiplyByScalar(t){return this.x*=t,this.y*=t,this}addScalar(t){return this.x+=t,this.y+=t,this}getMagnitude(){return Math.sqrt(this.x*this.x+this.y*this.y)}normalize(){const t=this.getMagnitude();return t&&(this.x/=t,this.y/=t),this}add(t){return this.x+=t.x,this.y+=t.y,this}substract(t){return this.x-=t.x,this.y-=t.y,this}dotProduct(t){return u.dotProduct(this,t)}applyMat3(t){if(9!==t.length)throw new Error("Matrix must contain 9 elements");const{x:i,y:s}=this,[r,e,,h,a,,n,x]=t;return this.x=i*r+s*h+n,this.y=i*e+s*a+x,this}lerp(t,i){return this.x+=i*(t.x-this.x),this.y+=i*(t.y-this.y),this}rotate(t,i){const s=Math.sin(i),r=Math.cos(i),e=this.x-t.x,h=this.y-t.y;return this.x=e*r-h*s+t.x,this.y=e*s+h*r+t.y,this}equals(t,i=6){return !!t&&(+this.x.toFixed(i)==+t.x.toFixed(i)&&+this.y.toFixed(i)==+t.y.toFixed(i))}toArray(){return [this.x,this.y]}toIntArray(){return new Int32Array(this)}toFloatArray(){return new Float32Array(this)}*[Symbol.iterator](){yield this.x,yield this.y;}}class c{constructor(t=0,i=0,s=0,r=1){this.x=t,this.y=i,this.z=s,this.w=r;}static fromRotationMatrix(t){return (new c).setFromRotationMatrix(t)}static fromEuler(t){return (new c).setFromEuler(t)}static fromVec3Angle(t,i){return (new c).setFromVec3Angle(t,i)}static fromVec3s(t,i){return (new c).setFromVec3s(t,i)}static normalize(t){return t.clone().normalize()}static invert(t){return t.clone().normalize().invert()}static dotProduct(t,i){return t.x*i.x+t.y*i.y+t.z*i.z+t.w*i.w}static getAngle(t,i){return t.getAngle(i)}static multiply(t,i){return t.clone().multiply(i)}static slerp(t,i,s){return t.clone().slerp(i,s)}static equals(t,i,s=6){return t.equals(i,s)}clone(){return new c(this.x,this.y,this.z,this.w)}set(t,i,s,r){return this.x=t,this.y=i,this.z=s,this.w=r,this}setFromVec3s(t,i){t=t.clone().normalize(),i=i.clone().normalize();let s=t.dotProduct(i)+1;if(s<1e-6)s=0,Math.abs(t.x)>Math.abs(t.z)?(this.x=-t.y,this.y=t.x,this.z=0):(this.x=0,this.y=-t.z,this.z=t.y);else {const{x:s,y:r,z:e}=t.crossProduct(i);this.x=s,this.y=r,this.z=e;}return this.w=s,this.normalize()}setFromQ(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}setFromRotationMatrix(t){if(16!==t.length)throw new Error("Matrix must contain 16 elements");const[i,s,r,e,h,a,n,x,o,y,_,u,l,c,z,m]=t,w=i+a+_;if(w>0){const t=.5/Math.sqrt(1+w);this.set((n-y)*t,(o-r)*t,(s-h)*t,.25/t);}else if(i>a&&i>_){const t=2*Math.sqrt(1+i-a-_);this.set(.25*t,(h+s)/t,(o+r)/t,(n-y)/t);}else if(a>_){const t=2*Math.sqrt(1+a-i-_);this.set((h+s)/t,.25*t,(y+n)/t,(o-r)/t);}else {const t=2*Math.sqrt(1+_-i-a);this.set((o+r)/t,(y+n)/t,.25*t,(s-h)/t);}return this}setFromEuler(t){const i=Math.cos(t.x/2),s=Math.cos(t.y/2),r=Math.cos(t.z/2),e=Math.sin(t.x/2),h=Math.sin(t.y/2),a=Math.sin(t.z/2);switch(t.order){case"XYZ":this.x=e*s*r+i*h*a,this.y=i*h*r-e*s*a,this.z=i*s*a+e*h*r,this.w=i*s*r-e*h*a;break;case"XZY":this.x=e*s*r-i*h*a,this.y=i*h*r-e*s*a,this.z=i*s*a+e*h*r,this.w=i*s*r+e*h*a;break;case"YXZ":this.x=e*s*r+i*h*a,this.y=i*h*r-e*s*a,this.z=i*s*a-e*h*r,this.w=i*s*r+e*h*a;break;case"YZX":this.x=e*s*r+i*h*a,this.y=i*h*r+e*s*a,this.z=i*s*a-e*h*r,this.w=i*s*r-e*h*a;break;case"ZXY":this.x=e*s*r-i*h*a,this.y=i*h*r+e*s*a,this.z=i*s*a+e*h*r,this.w=i*s*r-e*h*a;break;case"ZYX":this.x=e*s*r-i*h*a,this.y=i*h*r+e*s*a,this.z=i*s*a-e*h*r,this.w=i*s*r+e*h*a;}return this}setFromVec3Angle(t,i){const s=t.clone().normalize(),r=i/2,e=Math.sin(r);return this.x=s.x*e,this.y=s.y*e,this.z=s.z*e,this.w=Math.cos(r),this}getMagnitude(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}normalize(){const t=this.getMagnitude();return t&&(this.x/=t,this.y/=t,this.z/=t,this.w/=t),this}invert(){return this.normalize(),this.x*=-1,this.y*=-1,this.z*=-1,this}dotProduct(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}getAngle(t){return 2*Math.acos(Math.abs(n(this.dotProduct(t),-1,1)))}multiply(t){const{x:i,y:s,z:r,w:e}=this,{x:h,y:a,z:n,w:x}=t;return this.x=i*x+e*h+s*n-r*a,this.y=s*x+e*a+r*h-i*n,this.z=r*x+e*n+i*a-s*h,this.w=e*x-i*h-s*a-r*n,this}slerp(t,i){if(!(i=n(i,0,1)))return this;if(1===i)return this.setFromQ(t);const{x:s,y:r,z:e,w:h}=this,{x:a,y:x,z:o,w:y}=t,_=s*a+r*x+e*o+h*y;if(Math.abs(_)>=1)return this;const u=Math.acos(_),l=Math.sin(u);if(Math.abs(l)<1e-6)return this.x=.5*(s+a),this.y=.5*(r+x),this.z=.5*(e+o),this.w=.5*(h+y),this;const c=Math.sin((1-i)*u)/l,z=Math.sin(i*u)/l;return this.x=c*s+z*a,this.y=c*r+z*x,this.z=c*e+z*o,this.w=c*h+z*y,this}equals(t,i=6){return +this.x.toFixed(i)==+t.x.toFixed(i)&&+this.y.toFixed(i)==+t.y.toFixed(i)&&+this.z.toFixed(i)==+t.z.toFixed(i)&&+this.w.toFixed(i)==+t.w.toFixed(i)}}class z{constructor(t=0,i=0,s=0){this.length=3,this.x=t,this.y=i,this.z=s;}static multiplyByScalar(t,i){return new z(t.x*i,t.y*i,t.z*i)}static addScalar(t,i){return new z(t.x+i,t.y+i,t.z+i)}static normalize(t){return (new z).setFromVec3(t).normalize()}static add(t,i){return new z(t.x+i.x,t.y+i.y,t.z+i.z)}static substract(t,i){return new z(t.x-i.x,t.y-i.y,t.z-i.z)}static dotProduct(t,i){return t.x*i.x+t.y*i.y+t.z*i.z}static crossProduct(t,i){return new z(t.y*i.z-t.z*i.y,t.z*i.x-t.x*i.z,t.x*i.y-t.y*i.x)}static onVector(t,i){return t.clone().onVector(i)}static onPlane(t,i){return t.clone().onPlane(i)}static applyMat3(t,i){return t.clone().applyMat3(i)}static applyMat4(t,i){return t.clone().applyMat4(i)}static lerp(t,i,s){return t.clone().lerp(i,s)}static equals(t,i,s=6){return !!t&&t.equals(i,s)}static getDistance(t,i){const s=i.x-t.x,r=i.y-t.y,e=i.z-t.z;return Math.sqrt(s*s+r*r+e*e)}static getAngle(t,i){return t.getAngle(i)}clone(){return new z(this.x,this.y,this.z)}set(t,i,s){return this.x=t,this.y=i,this.z=s,this}setFromVec3(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}multiplyByScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}getMagnitude(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}getAngle(t){const i=this.getMagnitude()*t.getMagnitude();if(!i)return Math.PI/2;const s=this.dotProduct(t)/i;return Math.acos(n(s,-1,1))}normalize(){const t=this.getMagnitude();return t&&(this.x/=t,this.y/=t,this.z/=t),this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}substract(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}dotProduct(t){return z.dotProduct(this,t)}crossProduct(t){return this.x=this.y*t.z-this.z*t.y,this.y=this.z*t.x-this.x*t.z,this.z=this.x*t.y-this.y*t.x,this}onVector(t){const i=this.getMagnitude();return i?t.clone().multiplyByScalar(t.clone().dotProduct(this)/(i*i)):this.set(0,0,0)}onPlane(t){return this.substract(this.clone().onVector(t))}applyMat3(t){if(9!==t.length)throw new Error("Matrix must contain 9 elements");const{x:i,y:s,z:r}=this,[e,h,a,n,x,o,y,_,u]=t;return this.x=i*e+s*n+r*y,this.y=i*h+s*x+r*_,this.z=i*a+s*o+r*u,this}applyMat4(t){if(16!==t.length)throw new Error("Matrix must contain 16 elements");const{x:i,y:s,z:r}=this,[e,h,a,n,x,o,y,_,u,l,c,z,m,w,d,M]=t,g=1/(i*n+s*_+r*z+M);return this.x=(i*e+s*x+r*u+m)*g,this.y=(i*h+s*o+r*l+w)*g,this.z=(i*a+s*y+r*c+d)*g,this}lerp(t,i){return this.x+=i*(t.x-this.x),this.y+=i*(t.y-this.y),this.z+=i*(t.z-this.z),this}equals(t,i=6){return !!t&&(+this.x.toFixed(i)==+t.x.toFixed(i)&&+this.y.toFixed(i)==+t.y.toFixed(i)&&+this.z.toFixed(i)==+t.z.toFixed(i))}toArray(){return [this.x,this.y,this.z]}toIntArray(){return new Int32Array(this)}toFloatArray(){return new Float32Array(this)}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z;}}class m{constructor(){this.length=16,this._matrix=new Array(this.length),this._matrix[0]=1,this._matrix[1]=0,this._matrix[2]=0,this._matrix[3]=0,this._matrix[4]=0,this._matrix[5]=1,this._matrix[6]=0,this._matrix[7]=0,this._matrix[8]=0,this._matrix[9]=0,this._matrix[10]=1,this._matrix[11]=0,this._matrix[12]=0,this._matrix[13]=0,this._matrix[14]=0,this._matrix[15]=1;}get x_x(){return this._matrix[0]}get x_y(){return this._matrix[1]}get x_z(){return this._matrix[2]}get x_w(){return this._matrix[3]}get y_x(){return this._matrix[4]}get y_y(){return this._matrix[5]}get y_z(){return this._matrix[6]}get y_w(){return this._matrix[7]}get z_x(){return this._matrix[8]}get z_y(){return this._matrix[9]}get z_z(){return this._matrix[10]}get z_w(){return this._matrix[11]}get w_x(){return this._matrix[12]}get w_y(){return this._matrix[13]}get w_z(){return this._matrix[14]}get w_w(){return this._matrix[15]}static fromMat4(t){return (new m).setFromMat4(t)}static fromTRS(t,i,s){return (new m).setFromTRS(t,i,s)}static fromQuaternion(t){return (new m).setFromQuaternion(t)}static multiply(t,i){const s=new m;return s.set(t.x_x*i.x_x+t.x_y*i.y_x+t.x_z*i.z_x+t.x_w*i.w_x,t.x_x*i.x_y+t.x_y*i.y_y+t.x_z*i.z_y+t.x_w*i.w_y,t.x_x*i.x_z+t.x_y*i.y_z+t.x_z*i.z_z+t.x_w*i.w_z,t.x_x*i.x_w+t.x_y*i.y_w+t.x_z*i.z_w+t.x_w*i.w_w,t.y_x*i.x_x+t.y_y*i.y_x+t.y_z*i.z_x+t.y_w*i.w_x,t.y_x*i.x_y+t.y_y*i.y_y+t.y_z*i.z_y+t.y_w*i.w_y,t.y_x*i.x_z+t.y_y*i.y_z+t.y_z*i.z_z+t.y_w*i.w_z,t.y_x*i.x_w+t.y_y*i.y_w+t.y_z*i.z_w+t.y_w*i.w_w,t.z_x*i.x_x+t.z_y*i.y_x+t.z_z*i.z_x+t.z_w*i.w_x,t.z_x*i.x_y+t.z_y*i.y_y+t.z_z*i.z_y+t.z_w*i.w_y,t.z_x*i.x_z+t.z_y*i.y_z+t.z_z*i.z_z+t.z_w*i.w_z,t.z_x*i.x_w+t.z_y*i.y_w+t.z_z*i.z_w+t.z_w*i.w_w,t.w_x*i.x_x+t.w_y*i.y_x+t.w_z*i.z_x+t.w_w*i.w_x,t.w_x*i.x_y+t.w_y*i.y_y+t.w_z*i.z_y+t.w_w*i.w_y,t.w_x*i.x_z+t.w_y*i.y_z+t.w_z*i.z_z+t.w_w*i.w_z,t.w_x*i.x_w+t.w_y*i.y_w+t.w_z*i.z_w+t.w_w*i.w_w),s}static multiplyScalar(t,i){const s=new m;for(let r=0;r<this.length;r++)s._matrix[r]=t._matrix[r]*i;return s}static transpose(t){const i=new m;return i.set(t.x_x,t.y_x,t.z_x,t.w_x,t.x_y,t.y_y,t.z_y,t.w_y,t.x_z,t.y_z,t.z_z,t.w_z,t.x_w,t.y_w,t.z_w,t.w_w),i}static invert(t){const i=1/t.getDeterminant(),[s,r,e,h,a,n,x,o,y,_,u,l,c,z,w,d]=t._matrix;return (new m).set((x*l*z-o*u*z+o*_*w-n*l*w-x*_*d+n*u*d)*i,(h*u*z-e*l*z-h*_*w+r*l*w+e*_*d-r*u*d)*i,(e*o*z-h*x*z+h*n*w-r*o*w-e*n*d+r*x*d)*i,(h*x*_-e*o*_-h*n*u+r*o*u+e*n*l-r*x*l)*i,(o*u*c-x*l*c-o*y*w+a*l*w+x*y*d-a*u*d)*i,(e*l*c-h*u*c+h*y*w-s*l*w-e*y*d+s*u*d)*i,(h*x*c-e*o*c-h*a*w+s*o*w+e*a*d-s*x*d)*i,(e*o*y-h*x*y+h*a*u-s*o*u-e*a*l+s*x*l)*i,(n*l*c-o*_*c+o*y*z-a*l*z-n*y*d+a*_*d)*i,(h*_*c-r*l*c-h*y*z+s*l*z+r*y*d-s*_*d)*i,(r*o*c-h*n*c+h*a*z-s*o*z-r*a*d+s*n*d)*i,(h*n*y-r*o*y-h*a*_+s*o*_+r*a*l-s*n*l)*i,(x*_*c-n*u*c-x*y*z+a*u*z+n*y*w-a*_*w)*i,(r*u*c-e*_*c+e*y*z-s*u*z-r*y*w+s*_*w)*i,(e*n*c-r*x*c-e*a*z+s*x*z+r*a*w-s*n*w)*i,(r*x*y-e*n*y+e*a*_-s*x*_-r*a*u+s*n*u)*i)}static lookAt(t,i,s){const r=z.equals(t,i)?new z(0,0,1):z.substract(t,i).normalize();let e=z.crossProduct(s,r).normalize();e.getMagnitude()||(1===Math.abs(s.z)?r.x+=1e-5:r.z+=1e-5,r.normalize(),e=z.crossProduct(s,r).normalize());const h=z.crossProduct(r,e).normalize();return (new m).set(e.x,e.y,e.z,0,h.x,h.y,h.z,0,r.x,r.y,r.z,0,t.x,t.y,t.z,1)}static buildScale(t,i,s){return null!=i||(i=t),null!=s||(s=t),(new m).set(t,0,0,0,0,i,0,0,0,0,s,0,0,0,0,1)}static buildRotationX(t){const i=Math.cos(t),s=Math.sin(t);return (new m).set(1,0,0,0,0,i,s,0,0,-s,i,0,0,0,0,1)}static buildRotationY(t){const i=Math.cos(t),s=Math.sin(t);return (new m).set(i,0,-s,0,0,1,0,0,s,0,i,0,0,0,0,1)}static buildRotationZ(t){const i=Math.cos(t),s=Math.sin(t);return (new m).set(i,s,0,0,-s,i,0,0,0,0,1,0,0,0,0,1)}static buildTranslate(t,i,s){return (new m).set(1,0,0,0,0,1,0,0,0,0,1,0,t,i,s,1)}static buildOrthographic(t,i,s,r,e,h){return (new m).set(2/(r-s),0,0,0,0,2/(h-e),0,0,0,0,2/(t-i),0,(s+r)/(s-r),(e+h)/(e-h),(t+i)/(t-i),1)}static buildPerspective(t,i,...s){if(4===s.length){const[r,e,h,a]=s;return (new m).set(2*t/(e-r),0,0,0,0,2*t/(a-h),0,0,(e+r)/(e-r),(a+h)/(a-h),(t+i)/(t-i),-1,0,0,2*t*i/(t-i),0)}if(2===s.length){const[r,e]=s,h=Math.tan(.5*Math.PI-.5*r);return (new m).set(h/e,0,0,0,0,h,0,0,0,0,(t+i)/(t-i),-1,0,0,2*t*i/(t-i),0)}throw new Error("Incorrect args quantity")}static equals(t,i,s=6){return t.equals(i,s)}clone(){return (new m).set(this.x_x,this.x_y,this.x_z,this.x_w,this.y_x,this.y_y,this.y_z,this.y_w,this.z_x,this.z_y,this.z_z,this.z_w,this.w_x,this.w_y,this.w_z,this.w_w)}set(t,i,s,r,e,h,a,n,x,o,y,_,u,l,c,z){return this._matrix[0]=t,this._matrix[1]=i,this._matrix[2]=s,this._matrix[3]=r,this._matrix[4]=e,this._matrix[5]=h,this._matrix[6]=a,this._matrix[7]=n,this._matrix[8]=x,this._matrix[9]=o,this._matrix[10]=y,this._matrix[11]=_,this._matrix[12]=u,this._matrix[13]=l,this._matrix[14]=c,this._matrix[15]=z,this}reset(){return this._matrix[0]=1,this._matrix[1]=0,this._matrix[2]=0,this._matrix[3]=0,this._matrix[4]=0,this._matrix[5]=1,this._matrix[6]=0,this._matrix[7]=0,this._matrix[8]=0,this._matrix[9]=0,this._matrix[10]=1,this._matrix[11]=0,this._matrix[12]=0,this._matrix[13]=0,this._matrix[14]=0,this._matrix[15]=1,this}setFromMat4(t){for(let i=0;i<this.length;i++)this._matrix[i]=t._matrix[i];return this}setFromTRS(t,i,s){const r=2*i.x*i.x,e=2*i.y*i.x,h=2*i.z*i.x,a=2*i.y*i.y,n=2*i.z*i.y,x=2*i.z*i.z,o=2*i.x*i.w,y=2*i.y*i.w,_=2*i.z*i.w;return this.set((1-a-x)*s.x,(e+_)*s.x,(h-y)*s.x,0,(e-_)*s.y,(1-r-x)*s.y,(n+o)*s.y,0,(h+y)*s.z,(n-o)*s.z,(1-r-a)*s.z,0,t.x,t.y,t.z,1),this}setFromQuaternion(t){return this.setFromTRS(new z(0,0,0),t,new z(1,1,1))}multiply(t){const[i,s,r,e,h,a,n,x,o,y,_,u,l,c,z,m]=this._matrix,[w,d,M,g,p,b,F,f,P,q,S,A,R,B,V,E]=t._matrix;return this._matrix[0]=i*w+s*p+r*P+e*R,this._matrix[1]=i*d+s*b+r*q+e*B,this._matrix[2]=i*M+s*F+r*S+e*V,this._matrix[3]=i*g+s*f+r*A+e*E,this._matrix[4]=h*w+a*p+n*P+x*R,this._matrix[5]=h*d+a*b+n*q+x*B,this._matrix[6]=h*M+a*F+n*S+x*V,this._matrix[7]=h*g+a*f+n*A+x*E,this._matrix[8]=o*w+y*p+_*P+u*R,this._matrix[9]=o*d+y*b+_*q+u*B,this._matrix[10]=o*M+y*F+_*S+u*V,this._matrix[11]=o*g+y*f+_*A+u*E,this._matrix[12]=l*w+c*p+z*P+m*R,this._matrix[13]=l*d+c*b+z*q+m*B,this._matrix[14]=l*M+c*F+z*S+m*V,this._matrix[15]=l*g+c*f+z*A+m*E,this}multiplyScalar(t){for(let i=0;i<this.length;i++)this._matrix[i]*=t;return this}transpose(){const t=(new m).setFromMat4(this);return this.set(t.x_x,t.y_x,t.z_x,t.w_x,t.x_y,t.y_y,t.z_y,t.w_y,t.x_z,t.y_z,t.z_z,t.w_z,t.x_w,t.y_w,t.z_w,t.w_w),this}invert(){const t=1/this.getDeterminant(),[i,s,r,e,h,a,n,x,o,y,_,u,l,c,z,m]=this._matrix;return this.set((n*u*c-x*_*c+x*y*z-a*u*z-n*y*m+a*_*m)*t,(e*_*c-r*u*c-e*y*z+s*u*z+r*y*m-s*_*m)*t,(r*x*c-e*n*c+e*a*z-s*x*z-r*a*m+s*n*m)*t,(e*n*y-r*x*y-e*a*_+s*x*_+r*a*u-s*n*u)*t,(x*_*l-n*u*l-x*o*z+h*u*z+n*o*m-h*_*m)*t,(r*u*l-e*_*l+e*o*z-i*u*z-r*o*m+i*_*m)*t,(e*n*l-r*x*l-e*h*z+i*x*z+r*h*m-i*n*m)*t,(r*x*o-e*n*o+e*h*_-i*x*_-r*h*u+i*n*u)*t,(a*u*l-x*y*l+x*o*c-h*u*c-a*o*m+h*y*m)*t,(e*y*l-s*u*l-e*o*c+i*u*c+s*o*m-i*y*m)*t,(s*x*l-e*a*l+e*h*c-i*x*c-s*h*m+i*a*m)*t,(e*a*o-s*x*o-e*h*y+i*x*y+s*h*u-i*a*u)*t,(n*y*l-a*_*l-n*o*c+h*_*c+a*o*z-h*y*z)*t,(s*_*l-r*y*l+r*o*c-i*_*c-s*o*z+i*y*z)*t,(r*a*l-s*n*l-r*h*c+i*n*c+s*h*z-i*a*z)*t,(s*n*o-r*a*o+r*h*y-i*n*y-s*h*_+i*a*_)*t),this}getDeterminant(){const[t,i,s,r,e,h,a,n,x,o,y,_,u,l,c,z]=this._matrix;return r*a*o*u-s*n*o*u-r*h*y*u+i*n*y*u+s*h*_*u-i*a*_*u-r*a*x*l+s*n*x*l+r*e*y*l-t*n*y*l-s*e*_*l+t*a*_*l+r*h*x*c-i*n*x*c-r*e*o*c+t*n*o*c+i*e*_*c-t*h*_*c-s*h*x*z+i*a*x*z+s*e*o*z-t*a*o*z-i*e*y*z+t*h*y*z}getTRS(){const t=new z(this.w_x,this.w_y,this.w_z),i=this.getDeterminant(),s=new z(this.x_x,this.x_y,this.x_z).getMagnitude()*(i<0?-1:1),r=new z(this.y_x,this.y_y,this.y_z).getMagnitude(),e=new z(this.z_x,this.z_y,this.z_z).getMagnitude(),h=new z(s,r,e),a=(new m).set(this.x_x/s,this.x_y/s,this.x_z/s,0,this.y_x/r,this.y_y/r,this.y_z/r,0,this.z_x/e,this.z_y/e,this.z_z/e,0,0,0,0,1);return {t:t,r:c.fromRotationMatrix(a),s:h}}equals(t,i=6){for(let s=0;s<this.length;s++)if(+this._matrix[s].toFixed(i)!=+t._matrix[s].toFixed(i))return !1;return !0}applyScaling(t,i,s){const r=m.buildScale(t,i,s);return this.multiply(r)}applyTranslation(t,i,s){const r=m.buildTranslate(t,i,s);return this.multiply(r)}applyRotation(t,i){let s;switch(t){case"x":default:s=m.buildRotationX(i);break;case"y":s=m.buildRotationY(i);break;case"z":s=m.buildRotationZ(i);}return this.multiply(s)}toArray(){return this._matrix.slice()}toIntArray(){return new Int32Array(this)}toFloatArray(){return new Float32Array(this)}*[Symbol.iterator](){for(let t=0;t<this.length;t++)yield this._matrix[t];}}class g{constructor(t=0,i=0,s=0,r=1){this.length=4,this.x=t,this.y=i,this.z=s,this.w=r;}static fromVec3(t){return new g(t.x,t.y,t.z)}static multiplyByScalar(t,i){return new g(t.x*i,t.y*i,t.z*i,t.w*i)}static addScalar(t,i){return new g(t.x+i,t.y+i,t.z+i,t.w+i)}static normalize(t){return (new g).setFromVec4(t).normalize()}static add(t,i){return new g(t.x+i.x,t.y+i.y,t.z+i.z,t.w+i.w)}static substract(t,i){return new g(t.x-i.x,t.y-i.y,t.z-i.z,t.w-i.w)}static dotProduct(t,i){return t.x*i.x+t.y*i.y+t.z*i.z+t.w*i.w}static applyMat4(t,i){return t.clone().applyMat4(i)}static lerp(t,i,s){return t.clone().lerp(i,s)}static equals(t,i,s=6){return !!t&&t.equals(i,s)}clone(){return new g(this.x,this.y,this.z,this.w)}set(t,i,s,r){return this.x=t,this.y=i,this.z=s,this.w=r,this}setFromVec3(t){this.x=t.x,this.y=t.y,this.z=t.z,this.w=1;}setFromVec4(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}multiplyByScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}getMagnitude(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}normalize(){const t=this.getMagnitude();return t&&(this.x/=t,this.y/=t,this.z/=t,this.w/=t),this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}substract(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}dotProduct(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}applyMat4(t){if(16!==t.length)throw new Error("Matrix must contain 16 elements");const{x:i,y:s,z:r,w:e}=this,[h,a,n,x,o,y,_,u,l,c,z,m,w,d,M,g]=t;return this.x=i*h+s*o+r*l+e*w,this.y=i*a+s*y+r*c+e*d,this.z=i*n+s*_+r*z+e*M,this.w=i*x+s*u+r*m+e*g,this}lerp(t,i){return this.x+=i*(t.x-this.x),this.y+=i*(t.y-this.y),this.z+=i*(t.z-this.z),this.w+=i*(t.w-this.w),this}equals(t,i=6){return !!t&&(+this.x.toFixed(i)==+t.x.toFixed(i)&&+this.y.toFixed(i)==+t.y.toFixed(i)&&+this.z.toFixed(i)==+t.z.toFixed(i)&&+this.w.toFixed(i)==+t.w.toFixed(i))}toArray(){return [this.x,this.y,this.z,this.w]}toIntArray(){return new Int32Array(this)}toFloatArray(){return new Float32Array(this)}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w;}}

const shaderTypes = {
    FRAGMENT_SHADER: 0x8b30,
    VERTEX_SHADER: 0x8b31,
};
const bufferTypes = {
    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    UNIFORM_BUFFER: 0x8a11,
    TRANSFORM_FEEDBACK_BUFFER: 0x8c8e,
};
const textureTypes = {
    TEXTURE0: 0x84c0,
    TEXTURE_2D: 0x0DE1,
    TEXTURE_2D_ARRAY: 0x8C1A,
    TEXTURE_3D: 0x806F,
    TEXTURE_CUBE_MAP: 0x8513,
};
const texelTypes = {
    UNSIGNED_BYTE: 0x1401,
    UNSIGNED_SHORT_4_4_4_4: 0x8033,
    UNSIGNED_SHORT_5_5_5_1: 0x8034,
    UNSIGNED_SHORT_5_6_5: 0x8363,
    FLOAT: 0x1406,
};
const numberTypes = {
    BYTE: 0x1400,
    UNSIGNED_BYTE: 0x1401,
    SHORT: 0x1402,
    UNSIGNED_SHORT: 0x1403,
    INT: 0x1404,
    UNSIGNED_INT: 0x1405,
    FLOAT: 0x1406,
    BOOL: 0x8B56,
};
const numberSizes = {
    0x1400: 1,
    0x1401: 1,
    0x1402: 2,
    0x1403: 2,
    0x1404: 4,
    0x1405: 4,
    0x1406: 4,
};
const uniformFloatTypes = {
    FLOAT: numberTypes.FLOAT,
    FLOAT_VEC2: 0x8B50,
    FLOAT_VEC3: 0x8B51,
    FLOAT_VEC4: 0x8B52,
    FLOAT_MAT2: 0x8B5A,
    FLOAT_MAT3: 0x8B5B,
    FLOAT_MAT4: 0x8B5C,
};
const uniformIntTypes = {
    INT: numberTypes.INT,
    BOOL: numberTypes.BOOL,
    INT_VEC2: 0x8B53,
    INT_VEC3: 0x8B54,
    INT_VEC4: 0x8B55,
    BOOL_VEC2: 0x8B57,
    BOOL_VEC3: 0x8B58,
    BOOL_VEC4: 0x8B59,
};
const samplerTypes = {
    SAMPLER_2D: 0x8B5E,
    SAMPLER_CUBE: 0x8B60,
    SAMPLER_3D: 0x8B5F,
    SAMPLER_2D_SHADOW: 0x8B62,
    SAMPLER_2D_ARRAY: 0x8DC1,
    SAMPLER_2D_ARRAY_SHADOW: 0x8DC4,
    SAMPLER_CUBE_SHADOW: 0x8DC5,
    INT_SAMPLER_2D: 0x8DCA,
    INT_SAMPLER_3D: 0x8DCB,
    INT_SAMPLER_CUBE: 0x8DCC,
    INT_SAMPLER_2D_ARRAY: 0x8DCF,
    UNSIGNED_INT_SAMPLER_2D: 0x8DD2,
    UNSIGNED_INT_SAMPLER_3D: 0x8DD3,
    UNSIGNED_INT_SAMPLER_CUBE: 0x8DD4,
    UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8DD7,
};
const bufferUsageTypes = {
    STATIC_DRAW: 0x88E4,
    STREAM_DRAW: 0x88E0,
    DYNAMIC_DRAW: 0x88E8,
};
function getNumberTypeByArray(typedArray) {
    if (typedArray instanceof Int8Array) {
        return numberTypes.BYTE;
    }
    if (typedArray instanceof Uint8Array
        || typedArray instanceof Uint8ClampedArray) {
        return numberTypes.UNSIGNED_BYTE;
    }
    if (typedArray instanceof Int16Array) {
        return numberTypes.SHORT;
    }
    if (typedArray instanceof Uint16Array) {
        return numberTypes.UNSIGNED_SHORT;
    }
    if (typedArray instanceof Int32Array) {
        return numberTypes.INT;
    }
    if (typedArray instanceof Uint32Array) {
        return numberTypes.UNSIGNED_INT;
    }
    if (typedArray instanceof Float32Array) {
        return numberTypes.FLOAT;
    }
    throw new Error("Unsupported array type");
}

class Attribute {
    constructor(gl, program, name) {
        this._gl = gl;
        this._location = gl.getAttribLocation(program, name);
        this._name = name;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get location() {
        return this._location;
    }
}
class ConstantInfo extends Attribute {
    constructor(gl, program, name, values) {
        super(gl, program, name);
        this._type = getNumberTypeByArray(values);
        this._size = values.length;
        if (![1, 2, 3, 4, 9, 16].includes(this._size)) {
            throw new Error("Incorrect constant value length");
        }
    }
    set() {
        this._gl.disableVertexAttribArray(this._location);
        switch (this._type) {
            case numberTypes.FLOAT:
                switch (this._size) {
                    case 1:
                        this._gl.vertexAttrib1f(this._location, this._values[0]);
                        break;
                    case 2:
                        this._gl.vertexAttrib2fv(this._location, this._values);
                        break;
                    case 3:
                        this._gl.vertexAttrib3fv(this._location, this._values);
                        break;
                    case 4:
                        this._gl.vertexAttrib4fv(this._location, this._values);
                        break;
                    case 9:
                        const [a, b, c, d, e, f, g, h, i] = this._values;
                        this._gl.vertexAttrib3f(this._location, a, b, c);
                        this._gl.vertexAttrib3f(this._location + 1, d, e, f);
                        this._gl.vertexAttrib3f(this._location + 2, g, h, i);
                        break;
                    case 16:
                        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = this._values;
                        this._gl.vertexAttrib4f(this._location, x_x, x_y, x_z, x_w);
                        this._gl.vertexAttrib4f(this._location + 1, y_x, y_y, y_z, y_w);
                        this._gl.vertexAttrib4f(this._location + 2, z_x, z_y, z_z, z_w);
                        this._gl.vertexAttrib4f(this._location + 3, w_x, w_y, w_z, w_w);
                        break;
                    default:
                        throw new Error("Incorrect constant value length");
                }
                break;
            default:
                throw new Error("Unsupported constant attribute type");
        }
    }
    destroy() {
    }
}
class BufferInfo extends Attribute {
    constructor(gl, program, name, data, options, instancedExt) {
        super(gl, program, name);
        this._type = getNumberTypeByArray(data);
        const { usage, vectorSize, vectorNumber, stride, offset, normalize, divisor } = Object.assign({}, BufferInfo.defaultOptions, options);
        const minStride = vectorNumber
            ? vectorSize * vectorNumber * numberSizes[this.type]
            : 0;
        this._stride = Math.min(255, Math.max(minStride, stride));
        this._vectorOffset = this._stride && vectorNumber
            ? this._stride / vectorNumber
            : 0;
        this._vectorSize = vectorSize;
        this._vectorNumber = vectorNumber;
        this._offset = offset;
        this._normalize = normalize;
        this._divisor = divisor;
        this._instancedExt = instancedExt;
        this._buffer = gl.createBuffer();
        gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);
        gl.bufferData(bufferTypes.ARRAY_BUFFER, data, usage === "static"
            ? bufferUsageTypes.STATIC_DRAW
            : bufferUsageTypes.DYNAMIC_DRAW);
    }
    updateData(data, offset) {
        this._gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);
        this._gl.bufferSubData(bufferTypes.ARRAY_BUFFER, offset, data);
    }
    set() {
        this._gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);
        for (let i = 0, j = this._location; i < this._vectorNumber; i++, j++) {
            this._gl.enableVertexAttribArray(j);
            this._gl.vertexAttribPointer(j, this._vectorSize, this._type, this._normalize, this._stride, this._offset + i * this._vectorOffset);
            if (this._divisor && this._instancedExt) {
                this._instancedExt.vertexAttribDivisorANGLE(j, this._divisor);
            }
        }
    }
    destroy() {
        this._gl.deleteBuffer(this._buffer);
    }
}
BufferInfo.defaultOptions = {
    usage: "static",
    vectorSize: 1,
    vectorNumber: 1,
    stride: 0,
    offset: 0,
    normalize: false,
};
class IndexInfo extends Attribute {
    constructor(gl, program, data) {
        super(gl, program, "index");
        let type;
        if (data instanceof Uint8Array
            || data instanceof Uint8ClampedArray) {
            type = numberTypes.UNSIGNED_BYTE;
        }
        else if (data instanceof Uint16Array) {
            type = numberTypes.UNSIGNED_SHORT;
        }
        else if (data instanceof Uint32Array) {
            type = numberTypes.UNSIGNED_INT;
        }
        else {
            throw new Error("Unsupported index type");
        }
        this._type = type;
        this._buffer = gl.createBuffer();
        this._gl.bindBuffer(bufferTypes.ELEMENT_ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }
    set() {
        this._gl.bindBuffer(bufferTypes.ELEMENT_ARRAY_BUFFER, this._buffer);
    }
    destroy() {
        this._gl.deleteBuffer(this._buffer);
    }
}

class Uniform {
    constructor(gl, program, name) {
        this._gl = gl;
        this._location = gl.getUniformLocation(program, name);
        this._name = name;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get location() {
        return this._location;
    }
    setSampleArray(target, unit, textures) {
    }
}
class UniformIntInfo extends Uniform {
    constructor(gl, program, name, type, value) {
        super(gl, program, name);
        this._value = value;
        this._type = type;
    }
    set() {
        this._gl.uniform1i(this._location, this._value);
    }
    destroy() {
    }
}
class UniformFloatInfo extends Uniform {
    constructor(gl, program, name, value) {
        super(gl, program, name);
        this._type = 5126;
        this._value = value;
    }
    set() {
        this._gl.uniform1f(this._location, this._value);
    }
    destroy() {
    }
}
class UniformIntArrayInfo extends Uniform {
    constructor(gl, program, name, type, values) {
        super(gl, program, name);
        this._values = values;
        switch (type) {
            case numberTypes.INT:
            case numberTypes.BOOL:
                break;
            case uniformIntTypes.INT_VEC2:
            case uniformIntTypes.BOOL_VEC2:
                if (values.length !== 2) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformIntTypes.INT_VEC3:
            case uniformIntTypes.BOOL_VEC3:
                if (values.length !== 3) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformIntTypes.INT_VEC4:
            case uniformIntTypes.BOOL_VEC4:
                if (values.length !== 4) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            default:
                throw new Error(`Uniforms of type '${this._type}' are not supported by UniformIntArrayInfo`);
        }
        this._type = type;
    }
    set() {
        switch (this._type) {
            case numberTypes.INT:
            case numberTypes.BOOL:
                this._gl.uniform1iv(this._location, this._values);
                break;
            case uniformIntTypes.INT_VEC2:
            case uniformIntTypes.BOOL_VEC2:
                this._gl.uniform2iv(this._location, this._values);
                break;
            case uniformIntTypes.INT_VEC3:
            case uniformIntTypes.BOOL_VEC3:
                this._gl.uniform3iv(this._location, this._values);
                break;
            case uniformIntTypes.INT_VEC4:
            case uniformIntTypes.BOOL_VEC4:
                this._gl.uniform4iv(this._location, this._values);
                break;
            default:
                throw new Error(`Uniforms of type '${this._type}' are not supported by UniformIntArrayInfo`);
        }
    }
    destroy() {
    }
}
class UniformFloatArrayInfo extends Uniform {
    constructor(gl, program, name, type, values) {
        super(gl, program, name);
        this._values = values;
        switch (type) {
            case numberTypes.FLOAT:
                break;
            case uniformFloatTypes.FLOAT_VEC2:
                if (values.length !== 2) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformFloatTypes.FLOAT_VEC3:
                if (values.length !== 3) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformFloatTypes.FLOAT_VEC4:
            case uniformFloatTypes.FLOAT_MAT2:
                if (values.length !== 4) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformFloatTypes.FLOAT_MAT3:
                if (values.length !== 9) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformFloatTypes.FLOAT_MAT4:
                if (values.length !== 16) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            default:
                throw new Error(`Uniforms of type '${this._type}' are not supported by UniformFloatArrayInfo`);
        }
        this._type = type;
    }
    set() {
        switch (this._type) {
            case numberTypes.FLOAT:
                this._gl.uniform1fv(this._location, this._values);
                break;
            case uniformFloatTypes.FLOAT_VEC2:
                this._gl.uniform2fv(this._location, this._values);
                break;
            case uniformFloatTypes.FLOAT_VEC3:
                this._gl.uniform3fv(this._location, this._values);
                break;
            case uniformFloatTypes.FLOAT_VEC4:
                this._gl.uniform4fv(this._location, this._values);
                break;
            case uniformFloatTypes.FLOAT_MAT2:
                this._gl.uniformMatrix2fv(this._location, false, this._values);
                break;
            case uniformFloatTypes.FLOAT_MAT3:
                this._gl.uniformMatrix3fv(this._location, false, this._values);
                break;
            case uniformFloatTypes.FLOAT_MAT4:
                this._gl.uniformMatrix4fv(this._location, false, this._values);
                break;
            default:
                throw new Error(`Uniforms of type '${this._type}' are not supported by UniformFloatArrayInfo`);
        }
    }
    destroy() {
    }
}
class Texture extends Uniform {
    constructor(gl, program, name, unit, type, sampler) {
        super(gl, program, name);
        this._sampler = sampler;
        switch (type) {
            case samplerTypes.SAMPLER_2D:
            case samplerTypes.SAMPLER_2D_SHADOW:
            case samplerTypes.INT_SAMPLER_2D:
            case samplerTypes.UNSIGNED_INT_SAMPLER_2D:
                this._target = textureTypes.TEXTURE_2D;
                break;
            case samplerTypes.SAMPLER_CUBE:
            case samplerTypes.SAMPLER_CUBE_SHADOW:
            case samplerTypes.INT_SAMPLER_CUBE:
            case samplerTypes.UNSIGNED_INT_SAMPLER_CUBE:
                this._target = textureTypes.TEXTURE_CUBE_MAP;
                break;
            default:
                throw new Error(`Unsupported sampler type ${type}`);
        }
        this._type = type;
        this._unit = unit;
    }
}
class TextureInfo extends Texture {
    constructor(gl, program, name, unit, texture, type, sampler) {
        super(gl, program, name, unit, type, sampler);
        this._texture = texture;
    }
    set() {
        this._gl.uniform1i(this._location, this._unit);
        this._gl.activeTexture(textureTypes.TEXTURE0 + this._unit);
        this._gl.bindTexture(this._target, this._texture);
    }
    destroy() {
        this._gl.deleteTexture(this._texture);
    }
}
class TextureArrayInfo extends Texture {
    constructor(gl, program, name, unit, textures, type, sampler) {
        super(gl, program, name, unit, type, sampler);
        this._textures = textures;
    }
    set() {
        const units = new Int32Array(this._textures.length);
        for (let i = 0; i < this._textures.length; i++) {
            units[i] = this._unit + i;
        }
        this._gl.uniform1iv(this._location, units);
        this._textures.forEach((x, i) => {
            const unit = textureTypes.TEXTURE0 + units[i];
            this._gl.activeTexture(unit);
            this._gl.bindTexture(this._target, x);
        });
    }
    destroy() {
        this._textures.forEach(x => this._gl.deleteTexture(x));
    }
}

class WGLProgramBase {
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        this._attributes = new Map();
        this._uniforms = new Map();
        this._offset = 0;
        this._triangleCount = 0;
        const vertexShader = WGLProgramBase.loadShader(gl, shaderTypes.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = WGLProgramBase.loadShader(gl, shaderTypes.FRAGMENT_SHADER, fragmentShaderSource);
        this._extIndexed = gl.getExtension("OES_element_index_uint");
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        this._gl = gl;
        this._program = program;
        gl.linkProgram(program);
        const result = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!result) {
            const log = gl.getProgramInfoLog(program);
            this.destroy();
            throw new Error("Error while linking program: " + log);
        }
    }
    get offset() {
        return this._offset;
    }
    set offset(count) {
        this._offset = Math.max(0, count);
    }
    static loadShader(gl, shaderType, shaderSource) {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        const result = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!result) {
            const log = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error("Error while compiling shader: " + log);
        }
        return shader;
    }
    destroy() {
        this.clearUniforms();
        this.clearAttributes();
        this._gl.deleteProgram(this._program);
        this._gl.deleteShader(this._vertexShader);
        this._gl.deleteShader(this._fragmentShader);
    }
    setConstantScalarAttribute(name, s) {
        if (!name || isNaN(s)) {
            return;
        }
        const constant = new ConstantInfo(this._gl, this._program, name, new Float32Array([s]));
        this.setAttribute(constant);
    }
    setConstantVecAttribute(name, v) {
        if (!name || !v) {
            return;
        }
        const constant = new ConstantInfo(this._gl, this._program, name, v.toFloatArray());
        this.setAttribute(constant);
    }
    setConstantMatAttribute(name, m) {
        if (!name || !m) {
            return;
        }
        const constant = new ConstantInfo(this._gl, this._program, name, m.toFloatArray());
        this.setAttribute(constant);
    }
    setBufferAttribute(name, data, options) {
        if (!name || !data?.length) {
            return;
        }
        const buffer = new BufferInfo(this._gl, this._program, name, data, options);
        this.setAttribute(buffer);
    }
    setIndexAttribute(data) {
        if (!data?.length) {
            return;
        }
        if (!this._extIndexed && data instanceof Uint32Array) {
            throw new Error("'OES_element_index_uint' extension not supported");
        }
        const buffer = new IndexInfo(this._gl, this._program, data);
        this.setAttribute(buffer);
    }
    updateBufferAttribute(name, data, offset) {
        if (!name || !data) {
            return;
        }
        const attribute = this._attributes.get(name);
        if (!(attribute instanceof BufferInfo)) {
            return;
        }
        attribute.updateData(data, offset);
    }
    deleteAttribute(name) {
        const attribute = this._attributes.get(name);
        if (attribute) {
            attribute.destroy();
            this._attributes.delete(name);
        }
    }
    clearAttributes() {
        this._attributes.forEach((v, k) => this.deleteAttribute(k));
    }
    setBoolUniform(name, value) {
        const uniform = new UniformIntInfo(this._gl, this._program, name, numberTypes.INT, value ? 1 : 0);
        this.setUniform(uniform);
    }
    setBoolArrayUniform(name, data) {
        if (!name || !data?.length) {
            return;
        }
        const values = new Int32Array(data.length);
        for (let i = 0; i < data.length; i++) {
            values[i] = data[i] ? 1 : 0;
        }
        const uniform = new UniformIntArrayInfo(this._gl, this._program, name, numberTypes.BOOL, values);
        this.setUniform(uniform);
    }
    setIntUniform(name, value) {
        if (!name || isNaN(value)) {
            return;
        }
        const uniform = new UniformIntInfo(this._gl, this._program, name, numberTypes.INT, value);
        this.setUniform(uniform);
    }
    setIntArrayUniform(name, data) {
        if (!name || !data?.length) {
            return;
        }
        const uniform = new UniformIntArrayInfo(this._gl, this._program, name, numberTypes.INT, data);
        this.setUniform(uniform);
    }
    setIntVecUniform(name, data) {
        if (!name || !data) {
            return;
        }
        let type;
        switch (data.length) {
            case 2:
                type = uniformIntTypes.INT_VEC2;
                break;
            case 3:
                type = uniformIntTypes.INT_VEC3;
                break;
            case 4:
                type = uniformIntTypes.INT_VEC4;
                break;
            default:
                throw new Error("Incorrect vector length");
        }
        const uniform = new UniformIntArrayInfo(this._gl, this._program, name, type, data.toIntArray());
        this.setUniform(uniform);
    }
    setFloatUniform(name, value) {
        if (!name || isNaN(value)) {
            return;
        }
        const uniform = new UniformFloatInfo(this._gl, this._program, name, value);
        this.setUniform(uniform);
    }
    setFloatArrayUniform(name, data) {
        if (!name || !data?.length) {
            return;
        }
        const uniform = new UniformFloatArrayInfo(this._gl, this._program, name, numberTypes.FLOAT, data);
        this.setUniform(uniform);
    }
    setFloatVecUniform(name, data) {
        if (!name || !data) {
            return;
        }
        let type;
        switch (data.length) {
            case 2:
                type = uniformFloatTypes.FLOAT_VEC2;
                break;
            case 3:
                type = uniformFloatTypes.FLOAT_VEC3;
                break;
            case 4:
                type = uniformFloatTypes.FLOAT_VEC4;
                break;
            default:
                throw new Error("Incorrect vector length");
        }
        const uniform = new UniformFloatArrayInfo(this._gl, this._program, name, type, data.toFloatArray());
        this.setUniform(uniform);
    }
    setFloatMatUniform(name, data) {
        if (!name || !data) {
            return;
        }
        let type;
        switch (data.length) {
            case 4:
                type = uniformFloatTypes.FLOAT_MAT2;
                break;
            case 9:
                type = uniformFloatTypes.FLOAT_MAT3;
                break;
            case 16:
                type = uniformFloatTypes.FLOAT_MAT4;
                break;
            default:
                throw new Error("Incorrect matrix length");
        }
        const uniform = new UniformFloatArrayInfo(this._gl, this._program, name, type, data.toFloatArray());
        this.setUniform(uniform);
    }
    createTexture(data, type, texelFormal, texelType, width, height, forceNearestFilter = false) {
        if (texelType === texelTypes.UNSIGNED_BYTE) {
            if (!(data instanceof Uint8Array)) {
                throw new Error("Invalid data array type: must be Uint8Array");
            }
        }
        else if (texelType === texelTypes.FLOAT) {
            if (!(data instanceof Float32Array)) {
                throw new Error("Invalid data array type: must be Float32Array");
            }
            if (!this._gl.getExtension("OES_texture_float")
                || !this._gl.getExtension("OES_texture_float_linear")) {
                throw new Error("Float texture extensions not supported");
            }
        }
        else if (!(data instanceof Uint16Array)) {
            throw new Error("Invalid data array type: must be Uint16Array");
        }
        if (data.length !== width * height) {
            throw new Error("Invalid data array length");
        }
        const gl = this._gl;
        const texture = gl.createTexture();
        gl.bindTexture(type, texture);
        gl.texImage2D(type, 0, texelFormal, width, height, 0, texelFormal, texelType, data);
        if (forceNearestFilter) {
            gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
        else if (y(width) && y(height)) {
            gl.generateMipmap(type);
        }
        else {
            gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        return texture;
    }
    loadTexture(url, fallback = new Uint8Array([0, 0, 0, 255])) {
        if (!url || !(fallback instanceof Uint8Array)) {
            throw new Error("Invalid arguments");
        }
        const gl = this._gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, fallback);
        const image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            if (y(image.width) && y(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        };
        image.src = url;
        return texture;
    }
    setTexture(name, texture, type = samplerTypes.SAMPLER_2D, unit = 0) {
        if (!name || !texture) {
            return;
        }
        const uniform = new TextureInfo(this._gl, this._program, name, unit, texture, type);
        this._uniforms.set(name, uniform);
    }
    setTextureArray(name, textures, type = samplerTypes.SAMPLER_2D, unit = 0) {
        if (!name || !textures?.length) {
            return;
        }
        const uniform = new TextureArrayInfo(this._gl, this._program, name, unit, textures, type);
        this._uniforms.set(name, uniform);
    }
    createAndSet2dTexture(name, data, type, texelFormal, texelType, width, height, forceNearestFilter = false, unit = 0) {
        if (!name) {
            return;
        }
        const texture = this.createTexture(data, type, texelFormal, texelType, width, height, forceNearestFilter);
        this.setTexture(name, texture, type, unit);
    }
    loadAndSet2dTexture(name, url, unit = 0, fallback = new Uint8Array([0, 0, 0, 255])) {
        if (!name) {
            return;
        }
        const texture = this.loadTexture(url, fallback);
        this.setTexture(name, texture, samplerTypes.SAMPLER_2D, unit);
    }
    deleteUniform(name) {
        const uniform = this._uniforms.get(name);
        if (uniform) {
            uniform.destroy();
            this._uniforms.delete(name);
        }
    }
    clearUniforms() {
        this._uniforms.forEach((v, k) => this.deleteUniform(k));
    }
    setAttribute(attr) {
        const oldAttr = this._attributes.get(attr.name);
        if (oldAttr) {
            oldAttr.destroy();
        }
        this._attributes.set(attr.name, attr);
    }
    setUniform(uniform) {
        const oldUniform = this._attributes.get(uniform.name);
        if (oldUniform) {
            oldUniform.destroy();
        }
        this._uniforms.set(uniform.name, uniform);
    }
    set() {
        this._gl.useProgram(this._program);
        this._attributes.forEach(x => x.set());
        this._uniforms.forEach(x => x.set());
    }
}

class WGLStandardProgram extends WGLProgramBase {
    get triangleCount() {
        return this._triangleCount;
    }
    set triangleCount(count) {
        this._triangleCount = Math.max(0, count);
    }
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        super(gl, vertexShaderSource, fragmentShaderSource);
    }
    render(clear = true) {
        this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
        if (clear) {
            this.resetRender();
        }
        this.set();
        const index = this._attributes.get("index");
        if (index) {
            this._gl.drawElements(this._gl.TRIANGLES, this._triangleCount * 3, index.type, this._offset);
        }
        else {
            this._gl.drawArrays(this._gl.TRIANGLES, this._offset, this._triangleCount * 3);
        }
    }
    resetRender() {
        const gl = this._gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

class WGLInstancedProgram extends WGLStandardProgram {
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        super(gl, vertexShaderSource, fragmentShaderSource);
        this._instanceCount = 0;
        this._extInstanced = gl.getExtension("ANGLE_instanced_arrays");
        if (!this._extInstanced) {
            this.destroy();
            throw new Error("'ANGLE_instanced_arrays' extension not supported");
        }
    }
    get instanceCount() {
        return this._instanceCount;
    }
    set instanceCount(count) {
        this._instanceCount = Math.max(0, count);
    }
    render(clear = true) {
        this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
        if (clear) {
            this.resetRender();
        }
        this.set();
        const index = this._attributes.get("index");
        if (index) {
            this._extInstanced.drawElementsInstancedANGLE(this._gl.TRIANGLES, this._triangleCount * 3, index.type, this._offset, this._instanceCount);
        }
        else {
            this._extInstanced.drawArraysInstancedANGLE(this._gl.TRIANGLES, this._offset, this._triangleCount * 3, this._instanceCount);
        }
    }
    setInstancedBufferAttribute(name, data, options) {
        if (!data?.length) {
            return;
        }
        const buffer = new BufferInfo(this._gl, this._program, name, data, options, this._extInstanced);
        this.setAttribute(buffer);
    }
}

class Square {
    constructor(size = 1) {
        this._positions = new Float32Array([
            -size, -size, 0,
            size, -size, 0,
            -size, size, 0,
            size, size, 0,
        ]);
        this._normals = new Float32Array([
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ]);
        this._uvs = new Float32Array([
            0, 1,
            1, 1,
            0, 0,
            1, 0,
        ]);
        this._indices = new Uint32Array([0, 1, 2, 2, 1, 3]);
    }
    get positions() {
        return this._positions;
    }
    get normals() {
        return this._normals;
    }
    get uvs() {
        return this._uvs;
    }
    get indices() {
        return this._indices;
    }
}

class SpriteAnimationData {
    constructor(options) {
        this._dimensions = new g();
        this._sceneDimensions = new z();
        this._lastFrameTimestamp = 0;
        this._options = options;
        this._margin = Math.max(0, options.size[1], options.lineLength, options.onHoverLineLength);
        this._doubleMargin = this._margin * 2;
        const rect = new Square(1);
        this._primitive = rect;
    }
    get position() {
        return this._primitive.positions;
    }
    get uv() {
        return this._primitive.uvs;
    }
    get index() {
        return this._primitive.indices;
    }
    get triangles() {
        return this._primitive.indices.length / 3;
    }
    get length() {
        return this._length;
    }
    get iMatrix() {
        const length = this._length * 16;
        if (!this._iMatrix || this._iMatrix.length !== length) {
            this._iMatrix = new Float32Array(length);
        }
        const matrices = this._iMatrix;
        for (let i = 0; i < this._length; i++) {
            matrices.set(this._iDataSorted[i].mat.toFloatArray(), i * 16);
        }
        return matrices;
    }
    get iUv() {
        const length = this._length * 2;
        if (!this._iUv || this._iUv.length !== length) {
            this._iUv = new Float32Array(length);
        }
        const uvs = this._iUv;
        for (let i = 0; i < this._length; i++) {
            uvs.set(this._iDataSorted[i].uv, i * 2);
        }
        return uvs;
    }
    get iColor() {
        const length = this._length * 4;
        if (!this._iColor || this._iColor.length !== length) {
            this._iColor = new Float32Array(length);
        }
        const colors = this._iColor;
        for (let i = 0; i < this._length; i++) {
            colors.set(this._iDataSorted[i].color, i * 4);
        }
        return colors;
    }
    get sceneDimensions() {
        return this._sceneDimensions;
    }
    updateData(dimensions, pointerPosition, pointerDown, elapsedTime) {
        const t = elapsedTime - this._lastFrameTimestamp;
        this._lastFrameTimestamp = elapsedTime;
        if (this.updateDimensions(dimensions)) {
            this.updateLength();
        }
        const { x: dx, y: dy, z: dz } = this._sceneDimensions;
        const tempV2 = new u();
        for (let i = 0; i < this._length; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = iy + 1;
            const sx = this._iSizes[ix] / dx;
            const sy = this._iSizes[iy] / dy;
            const sz = this._iSizes[iz];
            const cx = this._iPositions[ix];
            const cy = this._iPositions[iy];
            const cz = this._iPositions[iz];
            const crz = this._iAngularPositions[i];
            const vx = this._iVelocities[ix];
            const vy = this._iVelocities[iy];
            const vz = this._iVelocities[iz];
            const wz = this._iAngularVelocities[i];
            const rz = (crz + t * wz) % (2 * Math.PI);
            let z = cz + t * vz / dz;
            if (z > -0.001) {
                z = -0.001;
                this._iVelocities[iz] = -vz;
            }
            else if (z < -0.999) {
                z = -0.999;
                this._iVelocities[iz] = -vz;
            }
            const [zdx, zdy] = this.getSceneDimensionsAtZ(z * dz, tempV2);
            const kx = zdx / dx;
            const ky = zdy / dy;
            const x = (cx + t * vx / dx) % kx;
            const y = (cy + t * vy / dy) % ky;
            const tx = (x < 0 ? x + kx : x) - kx / 2;
            const ty = (y < 0 ? y + ky : y) - ky / 2;
            const tz = z;
            this._iPositions[ix] = x;
            this._iPositions[iy] = y;
            this._iPositions[iz] = z;
            this._iAngularPositions[i] = rz;
            this._iData[i].mat.reset()
                .applyRotation("z", rz)
                .applyScaling(sx, sy, sz)
                .applyTranslation(tx, ty, tz);
        }
        this._iDataSorted.sort((a, b) => a.mat.w_z - b.mat.w_z);
    }
    getSceneDimensionsAtZ(z, out) {
        const cameraZ = this._dimensions.w;
        if (z < cameraZ) {
            z -= cameraZ;
        }
        else {
            z += cameraZ;
        }
        const fov = e(this._options.fov);
        const height = 2 * Math.tan(fov / 2) * Math.abs(z);
        const width = height / this._dimensions.y * this._dimensions.x;
        return out
            ? out.set(width + this._doubleMargin, height + this._doubleMargin)
            : new u(width + this._doubleMargin, height + this._doubleMargin);
    }
    updateDimensions(dimensions) {
        const resChanged = !dimensions.equals(this._dimensions);
        if (resChanged) {
            this._dimensions.setFromVec4(dimensions);
            this._sceneDimensions.set(dimensions.x + this._doubleMargin, dimensions.y + this._doubleMargin, dimensions.z);
        }
        return resChanged;
    }
    updateLength() {
        const length = Math.floor(this._options.fixedNumber
            ?? this._options.density * this._sceneDimensions.x * this._sceneDimensions.y);
        if (this._length !== length) {
            const oldLength = this._length || 0;
            const oldData = this._iData || [];
            const newSizesLength = length * 3;
            const newSizes = new Float32Array(newSizesLength);
            const oldSizes = this._iSizes;
            const oldSizesLength = oldSizes?.length || 0;
            const sizesIndex = Math.min(newSizesLength, oldSizesLength);
            if (oldSizesLength) {
                newSizes.set(oldSizes.subarray(0, sizesIndex), 0);
            }
            for (let i$1 = sizesIndex; i$1 < newSizesLength;) {
                const size = i(this._options.size[0], this._options.size[1]);
                newSizes[i$1++] = size;
                newSizes[i$1++] = size;
                newSizes[i$1++] = 1;
            }
            this._iSizes = newSizes;
            const newPositionsLength = length * 3;
            const newPositions = new Float32Array(newPositionsLength);
            const oldPositions = this._iPositions;
            const oldPositionsLength = oldPositions?.length || 0;
            const newPositionsIndex = Math.min(newPositionsLength, oldPositionsLength);
            if (oldPositionsLength) {
                newPositions.set(oldPositions.subarray(0, newPositionsIndex), 0);
            }
            for (let i$1 = newPositionsIndex; i$1 < newPositionsLength; i$1 += 3) {
                newPositions.set([i(0, 1), i(0, 1), i(-0.999, -0.001)], i$1);
            }
            this._iPositions = newPositions;
            const newAngularPositionsLength = length;
            const newAngularPositions = new Float32Array(newAngularPositionsLength);
            const oldAngularPositions = this._iPositions;
            const oldAngularPositionsLength = oldAngularPositions?.length || 0;
            const newAngularPositionsIndex = Math.min(newAngularPositionsLength, oldAngularPositionsLength);
            if (oldAngularPositionsLength) {
                newAngularPositions.set(oldAngularPositions.subarray(0, newAngularPositionsIndex), 0);
            }
            for (let i = newAngularPositionsIndex; i < newAngularPositionsLength; i++) {
                newAngularPositions.set([0], i);
            }
            this._iAngularPositions = newAngularPositions;
            const newVelocitiesLength = length * 3;
            const newVelocities = new Float32Array(newVelocitiesLength);
            const oldVelocities = this._iVelocities;
            const oldVelocitiesLength = oldVelocities?.length || 0;
            const velocitiesIndex = Math.min(newVelocitiesLength, oldVelocitiesLength);
            if (oldVelocitiesLength) {
                newVelocities.set(oldVelocities.subarray(0, velocitiesIndex), 0);
            }
            for (let i$1 = velocitiesIndex; i$1 < newVelocitiesLength;) {
                newVelocities[i$1++] = i(this._options.velocityX[0], this._options.velocityX[1]);
                newVelocities[i$1++] = i(this._options.velocityY[0], this._options.velocityY[1]);
                newVelocities[i$1++] = i(this._options.velocityZ[0], this._options.velocityZ[1]);
            }
            this._iVelocities = newVelocities;
            const newAngularVelocitiesLength = length;
            const newAngularVelocities = new Float32Array(newAngularVelocitiesLength);
            const oldAngularVelocities = this._iAngularVelocities;
            const oldAngularVelocitiesLength = oldAngularVelocities?.length || 0;
            const angularVelocitiesIndex = Math.min(newAngularVelocitiesLength, oldAngularVelocitiesLength);
            if (oldAngularVelocitiesLength) {
                newAngularVelocities.set(oldAngularVelocities.subarray(0, angularVelocitiesIndex), 0);
            }
            for (let i$1 = angularVelocitiesIndex; i$1 < newAngularVelocitiesLength; i$1++) {
                newAngularVelocities[i$1] = i(this._options.angularVelocity[0], this._options.angularVelocity[1]);
            }
            this._iAngularVelocities = newAngularVelocities;
            const data = new Array(length);
            let t;
            const dataCopyLength = Math.min(length, oldLength);
            for (let j = 0; j < dataCopyLength; j++) {
                data[j] = oldData[j];
            }
            if (dataCopyLength < length) {
                let uv;
                let color;
                let randomColor;
                for (let j = dataCopyLength; j < length; j++) {
                    t = j % 2
                        ? j + 1
                        : j;
                    uv = new Float32Array(2);
                    uv[0] = this._options.textureMap[t % this._options.textureMap.length];
                    uv[1] = this._options.textureMap[(t + 1) % this._options.textureMap.length];
                    color = new Float32Array(4);
                    randomColor = s(this._options.colors);
                    color[0] = randomColor[0] / 255;
                    color[1] = randomColor[1] / 255;
                    color[2] = randomColor[2] / 255;
                    color[3] = this._options.fixedOpacity || i(this._options.opacityMin ?? 0, 1);
                    data[j] = {
                        mat: new m(),
                        uv,
                        color,
                    };
                }
            }
            this._iData = data;
            this._iDataSorted = data.slice();
            this._length = length;
        }
    }
}

class SpriteAnimationControl {
    constructor(gl, options) {
        this._vertexShader = `
    #pragma vscode_glsllint_stage : vert

    attribute vec4 aColorInst;
    attribute vec3 aPosition;
    attribute vec2 aUv;
    attribute vec2 aUvInst;
    attribute mat4 aMatInst;

    uniform int uTexSize;
    uniform vec2 uResolution;
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    
    varying vec4 vColor;
    varying vec2 vUv;

    void main() {
      vColor = aColorInst;

      float texSize = float(uTexSize);
      vUv = vec2((aUvInst.x + aUv.x) / texSize, (aUvInst.y + aUv.y) / texSize);

      gl_Position = uProjection * uView * uModel * aMatInst * vec4(aPosition, 1.0);
    }
  `;
        this._fragmentShader = `
    #pragma vscode_glsllint_stage : frag  

    precision highp float;

    uniform sampler2D uTex;

    varying vec4 vColor;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(uTex, vUv);
      gl_FragColor = color * vColor;
    }
  `;
        this._lastResolution = new u();
        this._dimensions = new g();
        this._gl = gl;
        const finalOptions = options;
        if (!finalOptions.textureUrl) {
            throw new Error("Texture URL not defined");
        }
        this._fov = finalOptions.fov;
        this._depth = finalOptions.depth;
        this._program = new WGLInstancedProgram(gl, this._vertexShader, this._fragmentShader);
        this._data = new SpriteAnimationData(finalOptions);
        this._program.loadAndSet2dTexture("uTex", finalOptions.textureUrl);
        this._program.setIntUniform("uTexSize", finalOptions.textureSize || 1);
        this._program.setBufferAttribute("aPosition", this._data.position, { vectorSize: 3 });
        this._program.setBufferAttribute("aUv", this._data.uv, { vectorSize: 2 });
        this._program.setIndexAttribute(this._data.index);
    }
    prepareNextFrame(resolution, pointerPosition, pointerDown, elapsedTime) {
        const resChanged = !resolution.equals(this._lastResolution);
        if (resChanged) {
            const near = Math.tan(0.5 * Math.PI - 0.5 * e(this._fov)) * resolution.y / 2;
            this.resize(resolution);
            this._program.setIntVecUniform("uResolution", resolution);
            this._lastResolution.setFromVec2(resolution);
            this._dimensions.set(resolution.x, resolution.y, this._depth, near);
            this._data.updateData(this._dimensions, pointerPosition, pointerDown, elapsedTime);
            const viewMatrix = new m().applyTranslation(0, 0, -near);
            this._program.setFloatMatUniform("uView", viewMatrix);
            const outerSize = this._data.sceneDimensions;
            const modelMatrix = new m()
                .applyScaling(outerSize.x, outerSize.y, this._depth);
            this._program.setFloatMatUniform("uModel", modelMatrix);
            const projectionMatrix = m.buildPerspective(near, near + this._depth, -resolution.x / 2, resolution.x / 2, -resolution.y / 2, resolution.y / 2);
            this._program.setFloatMatUniform("uProjection", projectionMatrix);
            this._program.setInstancedBufferAttribute("aColorInst", this._data.iColor, { vectorSize: 4, vectorNumber: 1, divisor: 1, usage: "dynamic" });
            this._program.setInstancedBufferAttribute("aMatInst", this._data.iMatrix, { vectorSize: 4, vectorNumber: 4, divisor: 1, usage: "dynamic" });
            this._program.setInstancedBufferAttribute("aUvInst", this._data.iUv, { vectorSize: 2, divisor: 1, usage: "dynamic" });
        }
        else {
            this._data.updateData(this._dimensions, pointerPosition, pointerDown, elapsedTime);
            this._program.updateBufferAttribute("aColorInst", this._data.iColor, 0);
            this._program.updateBufferAttribute("aMatInst", this._data.iMatrix, 0);
            this._program.updateBufferAttribute("aUvInst", this._data.iUv, 0);
        }
    }
    renderFrame() {
        this._program.triangleCount = this._data.triangles;
        this._program.instanceCount = this._data.length;
        this._program.render();
    }
    clear() {
        this._program.resetRender();
    }
    destroy() {
        this._program.destroy();
        this._gl.getExtension("WEBGL_lose_context").loseContext();
    }
    resize(resolution) {
        this._gl.canvas.width = resolution.x;
        this._gl.canvas.height = resolution.y;
    }
}

const defaultSpriteAnimationOptions = {
    expectedFps: 60,
    fixedNumber: null,
    density: 0.0002,
    depth: 1000,
    fov: 120,
    size: [16, 64],
    velocityX: [-0.1, 0.1],
    velocityY: [-0.1, 0.1],
    velocityZ: [-0.1, 0.1],
    angularVelocity: [-0.001, 0.001],
    blur: 1,
    colors: [[255, 255, 255], [255, 244, 193], [250, 239, 219]],
    fixedOpacity: null,
    opacityMin: 0,
    opacityStep: 0,
    drawLines: true,
    lineColor: [113, 120, 146],
    lineLength: 150,
    lineWidth: 2,
    onClick: null,
    onHover: null,
    onClickCreateN: 10,
    onClickMoveR: 200,
    onHoverMoveR: 50,
    onHoverLineLength: 150,
    textureUrl: null,
    textureSize: null,
    textureMap: null,
};

function getRandomUuid() {
    return crypto.getRandomValues(new Uint32Array(4)).join("-");
}

class WGLAnimation {
    constructor(container, options, controlType) {
        this._resolution = new u();
        this._pointerPosition = new u();
        this._animationStartTimeStamp = 0;
        this._lastFrameTimeStamp = 0;
        this._lastPreparationTime = 0;
        this._lastRenderTime = 0;
        this.onResize = () => {
            const dpr = window.devicePixelRatio;
            const rect = this._container.getBoundingClientRect();
            const x = Math.floor(rect.width * dpr);
            const y = Math.floor(rect.height * dpr);
            this._resolution.set(x, y);
        };
        this.onPointerMove = (e) => {
            const dpr = window.devicePixelRatio;
            const parentRect = this._container.getBoundingClientRect();
            const xRelToDoc = parentRect.left +
                document.documentElement.scrollLeft;
            const yRelToDoc = parentRect.top +
                document.documentElement.scrollTop;
            const x = (e.clientX - xRelToDoc + window.pageXOffset) * dpr;
            const y = (e.clientY - yRelToDoc + window.pageYOffset) * dpr;
            this._pointerPosition.set(x, y);
        };
        this.onPointerDown = () => {
            this._pointerIsDown = true;
        };
        this.onPointerUp = () => {
            this._pointerIsDown = false;
        };
        this._options = options;
        this._container = container;
        this._controlType = controlType;
        this.initCanvas();
        this.initControl();
        this.addEventListeners();
    }
    destroy() {
        this.stop();
        this.removeEventListeners();
        this._control.destroy();
        this._canvas.remove();
    }
    start() {
        if (this._animationStartTimeStamp) {
            const timeSinceLastFrame = performance.now() - this._lastFrameTimeStamp;
            this._animationStartTimeStamp += timeSinceLastFrame;
        }
        this._animationTimerId = setInterval(() => {
            const framePreparationStart = performance.now();
            const elapsedTime = framePreparationStart - this._animationStartTimeStamp;
            this._control.prepareNextFrame(this._resolution, this._pointerPosition, this._pointerIsDown, elapsedTime);
            const framePreparationEnd = performance.now();
            this._lastPreparationTime = framePreparationEnd - framePreparationStart;
            requestAnimationFrame(() => {
                const frameRenderStart = performance.now();
                this._control.renderFrame();
                const frameRenderEnd = performance.now();
                this._lastFrameTimeStamp = frameRenderEnd;
                this._lastRenderTime = frameRenderEnd - frameRenderStart;
            });
        }, 1000 / this._options.expectedFps);
    }
    pause() {
        if (this._animationTimerId) {
            clearInterval(this._animationTimerId);
            this._animationTimerId = null;
        }
    }
    stop() {
        this.pause();
        this._animationStartTimeStamp = 0;
        window.setTimeout(() => this._control.clear(), 20);
    }
    initCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = getRandomUuid();
        canvas.style.display = "block";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.filter = `blur(${this._options.blur}px)`;
        console.log(this._options);
        this._container.append(canvas);
        this._canvas = canvas;
        this.onResize();
    }
    initControl() {
        this._control = new this._controlType(this._canvas.getContext("webgl"), this._options);
    }
    addEventListeners() {
        this._resizeObserver = new ResizeObserver(this.onResize);
        this._resizeObserver.observe(this._container);
        this._container.addEventListener("pointermove", this.onPointerMove);
        window.addEventListener("pointerdown", this.onPointerDown);
        window.addEventListener("pointerup", this.onPointerUp);
        window.addEventListener("blur", this.onPointerUp);
    }
    removeEventListeners() {
        this._resizeObserver.unobserve(this._container);
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
        this._container.removeEventListener("pointermove", this.onPointerMove);
        window.removeEventListener("pointerdown", this.onPointerDown);
        window.removeEventListener("pointerup", this.onPointerUp);
        window.removeEventListener("blur", this.onPointerUp);
    }
}

class WGLAnimationFactory {
    static createSpriteAnimation(containerSelector, options = null) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error("Container not found");
        }
        if (window.getComputedStyle(container).getPropertyValue("position") === "static") {
            throw new Error("Container is not positioned");
        }
        const finalOptions = Object.assign({}, defaultSpriteAnimationOptions, options);
        return new WGLAnimation(container, finalOptions, SpriteAnimationControl);
    }
}

export { WGLAnimationFactory };
