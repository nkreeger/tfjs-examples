/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 * =============================================================================
 */

import * as socketioClient from 'socket.io-client';
import Vue from 'vue';

import {AccuracyPerClass} from '../types';

const SOCKET = 'http://localhost:8001/';

// tslint:disable-next-line:no-default-export
export default Vue.extend({
  // tslint:disable-next-line:object-literal-shorthand
  mounted: function() {
    const socket = socketioClient(
        SOCKET, {reconnectionDelay: 300, reconnectionDelayMax: 300});
    socket.connect();

    socket.on('accuracyPerClass', (accPerClass: AccuracyPerClass) => {
      plotAccuracyPerClass(accPerClass);
    });

    socket.on('disconnect', () => {
      // Clear out training table on disconnect.
      const table = document.getElementById('table');
      table.innerHTML = '';
    });
  }
});

function plotAccuracyPerClass(accPerClass: AccuracyPerClass) {
  const table = document.getElementById('table');
  table.innerHTML = '';

  const BAR_WIDTH_PX = 300;

  for (const label in accPerClass) {
    // Row.
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    table.appendChild(rowDiv);

    // Label.
    const labelDiv = document.createElement('div');
    labelDiv.innerText = label;
    labelDiv.className = 'label';
    rowDiv.appendChild(labelDiv);

    // Score.
    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'score-container';
    scoreContainer.style.width = BAR_WIDTH_PX + 'px';

    const scoreDiv = document.createElement('div');
    scoreDiv.className = 'score';
    const score = accPerClass[label].training;
    scoreDiv.style.width = (score * BAR_WIDTH_PX) + 'px';
    scoreDiv.innerHTML = (score * 100).toFixed(1) + '%';

    scoreContainer.appendChild(scoreDiv);
    rowDiv.appendChild(scoreContainer);
  }
}
