/* ========================================================================
 * adpresso-ui framework
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
   this.built_ = true;
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
   var $this = this,
       cntr;
   $this.con_.append(this.label_);

   if($this.state_ === 'view'){
     cntr = $this.static_
   } else {
     cntr = $this.control_;
   }
   $this.contrCon_.append(cntr);

   if($this.attr_['ad-hide'] || $this.attr_['ad-hide'] === ''){
     $this.con_.hide();
   }
   $this.con_.append($this.contrCon_);

   return $this.con_;
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

 var textControlPrototype = cm.TextControl.prototype;

 textControlPrototype.renderControl = function(){
   var val = '';
   if(this.state_ === 'edit' && this.model_ && this.model_[this.id]){
     val = this.model_[this.id];
   }
   this.control_ = $('<input/>')
     .attr('type','text')
     .addClass('form-control input-sm')
     .val(val);
 };

 textControlPrototype.renderStatic = function(){
   var val = '';
   if(this.model_ && this.model_[this.id]){
     val = this.mode_l[this.id];
   }
   this.static = $('<p/>')
     .text(val)
     .addClass('form-control-static');
 };

 textControlPrototype.renderPartial = function(){
   var $this = this,
       id =  $this.id,
       val = $this.getLRVal(),
       stae = $this.state_;

   if(state === 'view'){
     $this.renderStatic();
     $this.static_.attr('id', id);
     $this.static_.text(val);
     $this.lastRndr_.replaceWith($this.static_);

     $this.lastRndr_ = $this.static_;
   }

   if(state === 'form' || state === 'edit'){
     $this.renderControl();

     if($this.attr_['validate'] || $this.attr_['validate'] === ''){
       $this.label_.text('*' + this.attr_['label']);
       $this.control_.attr('data-val','true').attr('data-val-required', $this.attr_['label'] + 'is required.');
     }

     $this.control_.attr('id', id);

     if(state === 'edit'){
       // Check model
       //
       // TODO: This can be an inssue in the future...
       // ... needs to be indicated that a new model was applied
       // so control knows to use model data insted of previously enterd data in
       // event of changing state
       //
       if($this.model_){
         val = $this.model_[this.id];
       }
       $this.control_.val(val);
       }

     $this.lastRndr_.replaceWith($this.control_);

     $this.lastRndr_ = $this.control_;
   }
 };

 // Retrieve Last rendered control value
 textControlPrototype.getLRVal = function(){
   if(this.lastRndr_.prop("tagName") === 'P'){
     return this.lastRndr_.text();
   } else {
     return this.lastRndr_.val();
   }
 };

 textControlPrototype.renderDom = function(){
   var $this = this,
       attr = $this.attr_,
       state = $this.state_,
       id = $this.id,
       width = 6,
       widthAdj;

   if($this.built_){
     this.renderPartial();
     return;
   }

   // Call base class' render method to render
   // grup...
   cm.TextControl.base(this, 'renderDom');

   // Setting few parameter on the group elements
   $this.con_.attr('id','con_' + id);
   $this.label_.attr('for', id);

   // Adding label column size
   if(attr['wlable']){
     widt = attr['wlable'];
   }
   $this.label_.addClass('col-md-' + width);

   width = 6;

   // Adding control column size
   if(attr['wcontrol']){
     width = attr['wcontrol'];
   }
   $this.contrCon_.addClass('col-md-' + width);


   // Redering different ways
   if(state === 'form' || state === 'edit'){
     if(attr['validate'] || attr['validate'] === ''){
       $this.label_.text('*' + attr['label']);
       $this.control_.attr('data-val','true').attr('data-val-required', attr['label'] + 'is required.');
     } else {
       $this.label_.text(attr['label']);
     }
     $this.control_.attr('id', id).attr('name', id);
     $this.lastRndr_ = $this.control_;
   }

   if(state === 'view'){
     $this.label_.text(attr['label']);
     $this.static_.attr('id', id).attr('name', id);

     $this.lastRndr_ = $this.static_;
   }

 };

 textControlPrototype.get = function(){
   return this.control_.val();
 };

 textControlPrototype.set = function(value){
   this.control_.val(value);
 };

 /**
  * Register controls.
  */
 cm.registerControl('ad-text', cm.TextControl);
