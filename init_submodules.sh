#!/bin/sh
RUN mkdir domain-repos
git init
git submodule init
git submodule update

# ONEST
git submodule add -b draft-ONEST10-2.0.0 https://github.com/ONDC-Official/ONDC-ONEST-Specifications apps/backend/domain-repos/@onest/draft-ONEST10-2.0.0