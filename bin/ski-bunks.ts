#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SkiBunkBackend } from '../lib/ski-bunks-backend';
import { SkiBunkFrontend } from '../lib/ski-bunk-frontend';

const app = new cdk.App();

new SkiBunkFrontend(app, 'SkiBunkFrontend').addDependency(new SkiBunkBackend(app, 'SkiBunkBackend'));
