/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { css, styled } from '@superset-ui/core';

export default styled.div`
  ${({ theme }) => css`
    table {
      width: 100%;
      min-width: auto;
      max-width: none;
      margin: 0;
    }

    th,
    td {
      min-width: 4.3em;
    }

    thead > tr > th {
      padding-right: 0;
      position: relative;
      background: ${theme.colors.grayscale.light5};
      text-align: left;
    }
    th svg {
      color: ${theme.colors.grayscale.light2};
      margin: ${theme.gridUnit / 2}px;
    }
    th.is-sorted svg {
      color: ${theme.colors.grayscale.base};
    }
    .table > tbody > tr:first-of-type > td,
    .table > tbody > tr:first-of-type > th {
      border-top: 0;
    }

    .table > tbody tr td {
      font-feature-settings: 'tnum' 1;
    }

    .dt-controls {
      padding-bottom: 0.65em;
    }
    .dt-metric {
      text-align: right;
    }
    .dt-totals {
      font-weight: ${theme.typography.weights.bold};
    }
    .dt-is-null {
      color: ${theme.colors.grayscale.light1};
    }
    td.dt-is-filter {
      cursor: pointer;
    }
    td.dt-is-filter:hover {
      background-color: ${theme.colors.secondary.light4};
    }
    td.dt-is-active-filter,
    td.dt-is-active-filter:hover {
      background-color: ${theme.colors.secondary.light3};
    }

    .dt-global-filter {
      float: right;
    }

    .dt-truncate-cell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dt-truncate-cell:hover {
      overflow: visible;
      white-space: normal;
      height: auto;
    }

    .dt-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${theme.gridUnit * 2}px ${theme.gridUnit * 3}px;
      margin-top: ${theme.gridUnit * 2}px;
    }
    .dt-pagination .pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      margin: ${theme.gridUnit * 4}px 0;
      padding: 0;
      gap: ${theme.gridUnit}px;
      font-size: ${theme.typography.sizes.s}px;

      li {
        display: inline-block;
        flex-shrink: 0;

        a,
        span {
          display: inline-block;
          padding: ${theme.gridUnit * 2}px ${theme.gridUnit * 3}px;
          text-decoration: none;
          background-color: ${theme.colors.grayscale.light5};
          border-radius: ${theme.borderRadius}px;
          border: 1px solid ${theme.colors.grayscale.light2};
          color: ${theme.colors.grayscale.dark1};
          cursor: pointer;
          line-height: 1;
          min-width: ${theme.gridUnit * 8}px;
          text-align: center;

          &:hover,
          &:focus {
            z-index: 2;
            color: ${theme.colors.grayscale.dark1};
            background-color: ${theme.colors.grayscale.light3};
            border-color: ${theme.colors.grayscale.light2};
            text-decoration: none;
          }
        }

        &.disabled {
          a,
          span {
            background-color: transparent;
            border-color: transparent;
            cursor: default;
            color: ${theme.colors.grayscale.light1};

            &:focus {
              outline: none;
            }

            &:hover {
              background-color: transparent;
              border-color: transparent;
            }
          }
        }

        &.active {
          a,
          span {
            z-index: 3;
            color: ${theme.colors.grayscale.light5};
            cursor: default;
            background-color: ${theme.colors.primary.base};
            border-color: ${theme.colors.primary.base};

            &:focus {
              outline: none;
            }
          }
        }

        &.dt-pagination-ellipsis {
          span {
            border-color: transparent;

            &:hover,
            &:focus {
              background-color: ${theme.colors.grayscale.light5};
              border-color: transparent;
              cursor: default;
            }
          }
        }
      }
    }

    .dt-no-results {
      text-align: center;
      padding: 1em 0.6em;
    }

    .right-border-only {
      border-right: 2px solid ${theme.colors.grayscale.light2};
    }
    table .right-border-only:last-child {
      border-right: none;
    }
  `}
`;
