/* ========================================================================
 * controls.js v1.0.0
 * ========================================================================
 * Copyright 2017 A. D.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

 cm.div = function(cl){
   var c = $('<div/>');
   if(cl){
     c.addClass(cl);
   }
   return c;
 };

 cm.GroupControl = function(){
   cm.Control.call(this);
 };
 cm.inherits(cm.GroupControl, cm.Control);

 var groupControlPrototype = cm.GroupControl.prototype;
 groupControlPrototype.renderDom = function(){
   this.renderCon();
   this.renderLabel();
   this.renderControlCon();

   if(this.state_ === 'view'){
     this.renderStatic();
   } else {
     this.renderControl();
   }

   this.control_ = this.assemble();
 };
 groupControlPrototype.renderCon = function(){
   this.con_ = cm.div('form-group');
 };

 groupControlPrototype.renderLabel = function(){
   this.label_ = $('<label/>').addClass('control-label');
 };

 groupControlPrototype.renderControlCon = function(){
   this.contrCon_ = cm.div();
 };

 groupControlPrototype.assemble = function(){
   this.label_.appendTo(this.con);
   if(this.state_ === 'view'){
     this.contrCon.append(this.static_);
   } else {
     this.contrCon.append(this.control_);
   }
   if(this.attr['ad-hide'] || this.attr['ad-hide'] === ''){
     this.con.hide();
   }
   this.contrCon.appendTo(this.con);
   
 };

 /**
  * TextControl - class represents basic text control.
  *
  *
  */
 cm.TextControl = function(){
   cm.GroupControl.call(this);
 };
 cm.inherits(cm.TextControl, cm.GroupControl);

 cm.GroupControl.prototype.renderDom = function(){

 };


 /**
  * Register controls.
  */
 cm.registerControl('ad-text', cm.TextControl);
