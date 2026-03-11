'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  ChevronDown, ChevronUp, CheckCircle2, AlertCircle,
  Building2, User, Mail, Phone, Hash, Calendar, FileText,
  ShoppingCart, ArrowRight, Loader2
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────
type Product = { code: string; ja: string; pt: string; badge?: string };
type Category = { id: string; ja: string; pt: string; emoji: string; items: Product[] };

// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGO COMPLETO (extraído do site antigo)
// ─────────────────────────────────────────────────────────────────────────────
const CATALOG: Category[] = [
  {
    id: 'joton',
    ja: 'パン（常温）',
    pt: 'Pães (Temperatura Ambiente)',
    emoji: '🍞',
    items: [
      { code: '7',   ja: 'ﾐﾙｸｸﾞｱﾊﾞﾋﾞｽｹｯﾄ135g',              pt: 'Bolacha Nata com Goiabada 135g' },
      { code: '27',   ja: 'ﾊﾟﾝﾃﾞｻｳ6個入',                 pt: 'Pão de Sal 6 unidades' },
      { code: '28',   ja: 'ハンバーガーパン 2個入り',             pt: 'Pão para Hamburguer c/2' },
      { code: '29',  ja: 'ハンバーガーパン ゴマかけ 2個入り',    pt: 'Pão para Hamburguer c/ Gergelim 2un' },
      { code: '30',  ja: 'ホットドッグ用パン 2個入り',           pt: 'Pão para Hot Dog c/2' },
      { code: '31',  ja: 'ホットドッグ用パン 4個入り',           pt: 'Pão para Hot Dog c/4' },
      { code: '32',   ja: 'ライ麦スライスパン 6枚',              pt: 'Pão Integral Fatiado 6 fatias' },
      { code: '33',  ja: 'ライ麦スライスパン 18枚',             pt: 'Pão Integral Fatiado 18 fatias' },
      { code: '34',   ja: 'ｿｳﾞｧﾄﾞﾊﾟﾝ',             pt: 'Pão Sovado' },
      { code: '35',   ja: 'クリームパン プレシオザ',              pt: 'Preciosa' },
      { code: '38',   ja: 'ｺｺﾅｯﾂﾁｰｽﾞｹｰｷ3個入',          pt: 'Queijadinha com 3 unidades' },
      { code: '39',   ja: 'ココナッツ卵ﾎﾞｰﾛ 135g',                  pt: 'Sequilho de Coco' },
      { code: '40',   ja: 'ﾐﾆｿｳﾞｧﾄﾞﾊﾟﾝ',                    pt: 'Sovadinho' },
      { code: '41',  ja: 'ﾋﾞｯｸﾞﾊﾞｰｶﾞｰﾊﾟﾝ2個入',              pt: 'Hamburgão c/2' },
      { code: '42',  ja: 'ﾐﾆﾊﾝﾊﾞｰｶﾞｰﾊﾟﾝ6個入',         pt: 'Mini Pão Hamburguer c/6' },
      { code: '24',   ja: 'メレンゲ',                           pt: 'Suspiro' },
      { code: '26',  ja: 'メレンゲ Lサイズ',                   pt: 'Suspiro L' },
      { code: '15',   ja: 'ﾌﾞﾘｵｯｼｭﾊﾝﾊﾞｰｶﾞｰ6個入',                    pt: 'Pão p/ Hamburguer brioche C/6' },
      { code: '103',   ja: 'グアバリング',                        pt: 'Rosca de Goiaba' },
      { code: '105',   ja: 'グァバロール',                    pt: 'Caracol de Goiaba' },
      { code: '106',   ja: 'シナモンロール',                      pt: 'Caracol de Canela' },
      { code: '164',   ja: 'ｺｰﾝｶｽﾃﾗｱﾆｽｼｰﾄﾞ入り',        pt: 'Bolo de Fubá com Erva Doce' },
      { code: '166',   ja: 'おからパン',                          pt: 'Pão de Okara' },
      { code: '4',   ja: 'ミニバターパン 4個入り',              pt: 'Bisnaga c/4' },
      { code: '5',   ja: 'ミニバターパン 8個入り',              pt: 'Bisnaga c/8' },
      { code: '3',   ja: 'ミニバターパン 6個入り',              pt: 'Bisnaguinha c/6' },
      { code: '6',   ja: 'ミニバターパン 12個入り',              pt: 'Bisnaguinha c/12' },
      { code: '134',  ja: '廃版 ｺｰﾝﾊﾟﾝ 6個入',              pt: 'Pão de Milho c/6' },
      { code: '135',  ja: 'ｺｰﾝﾊﾟﾝ焼きたて冷凍 6個入',              pt: 'Pão de Milho c/6 Assado' },
      { code: '177',  ja: 'スライスクリームパン',        pt: 'Pão com Creme Fatiado' },
      { code: '49',   ja: 'ﾐﾆﾌﾗﾝｽﾊﾟﾝ（生）',                    pt: 'Mini Pão Francês' },
      { code: '10',   ja: 'ｺｺﾅｯﾂｿﾌﾄｹｰｷ 250g 冷蔵保存',               pt: 'Bolo Fazendeiro' },
      { code: '11',   ja: 'コーンミールカステラ',                 pt: 'Bolo de Fubá' },
      { code: '13',   ja: 'ﾀﾋﾟｵｶｽﾅｯｸﾘﾝｸﾞ70g',             pt: 'Biscoito de Polvilho argola 70gr' },
      { code: '14',   ja: 'ﾀﾋﾟｵｶｽﾅｯｸﾊﾞｰ 60g',              pt: 'Biscoito de Polvilho Palito' },
      { code: '16',   ja: 'ｺｺﾅｯﾂ焼き菓子 125g',                  pt: 'Cocadinha 125g' },
      { code: '17',   ja: 'ｸﾞｱﾊﾞｸｯｷｰ 145g',                      pt: 'Goiabinha 145g' },
      { code: '18',  ja: 'イタリアンパン',                      pt: 'Pão Italiano' },
      { code: '19',   ja: 'ｺｺﾅｯﾂｽﾃｨｯｸﾊﾟﾝ',               pt: 'Lingua de Sogra' },
      { code: '20',   ja: 'ｺｺﾅｯﾂﾏｼｭﾏﾛ 110g',               pt: 'Maria Mole 110g' },
      { code: '21',   ja: 'ﾐﾆｺｺﾅｯﾂﾘﾝｸﾞﾊﾟﾝ',                    pt: 'Rosca de Coco' },
      { code: '123',   ja: 'ｷｬﾗﾒﾙｿｰｽﾊﾟﾝ 3個入',                 pt: 'Pão com Doce de Leite' },
    ],
  },
  {
    id: 'reito',
    ja: '冷凍パン',
    pt: 'Pães Congelados',
    emoji: '❄️',
    items: [
      { code: '22',  ja: 'ﾍﾞﾄﾅﾑ風ﾊﾟﾝ冷凍4個入',              pt: 'Pão Vietnã c/4' },
      { code: '44',  ja: 'ﾊﾞｹﾞｯﾄﾊﾟﾝﾌﾟﾚﾝ（生）',                      pt: 'Bengala Cru' },
      { code: '49',  ja: '冷凍ミニフランスパン 6個入り 焼',   pt: 'Mini Pão Francês Assado Congelado c/6' },
      { code: '50',  ja: '生フランスパン A',                    pt: 'Pão Francês A Cru' },
      { code: '51',  ja: '生フランスパン B',                    pt: 'Pão Francês B Cru' },
      { code: '52',  ja: '生フランスパン ひまわり種',            pt: 'Pão Francês com Grãos Cru' },
      { code: '53', ja: '生フランスパン 12HS',                 pt: 'Pão Francês 12hs Cru' },
      { code: '54',ja: '冷凍焼いたフランスパン業務用 100個入り', pt: 'Pão Francês Assado c/100 (Industrial)' },
      { code: '55',  ja: '生ソフトフランスマンジパン',           pt: 'Pão Mandi' },
      { code: 'FPF6',  ja: '冷凍焼いたフランスパン 6個入り',       pt: 'Pão Francês Assado Congelado c/6' },
      { code: 'FMF8',  ja: '冷凍ミニフランスパン 8個入り',         pt: 'Mini Pão Francês Assado c/8 Congelado' },
      { code: 'FPH2',  ja: '冷凍ハンバーガー用パン 2個入り',       pt: 'Pão para Hamburguer c/2 Congelado' },
      { code: 'ALHO',  ja: 'にんにくパン',                        pt: 'Pão de Alho Congelado' },
      { code: 'PIZD',  ja: 'ピッザ生地 50個入り',                 pt: 'Disco de Pizza c/50' },
      { code: 'MNCFC', ja: '生キャサバパン チキンクリームチーズ',   pt: 'Pão de Mandioca Cru Frango Catupiry' },
      { code: 'MNCC',  ja: '生キャサバパン 牛肉入り',              pt: 'Pão de Mandioca Cru Carne Desfiada' },
      { code: 'MNCAL', ja: '生キャサバパン スモークソーセージ',     pt: 'Pão de Mandioca Cru Calabresa' },
      { code: 'MNAFC', ja: 'チキンクリームチーズキャサバパン / レンジOK', pt: 'Pão de Mandioca Assado Frango Catupiry', badge: 'レンジOK' },
      { code: 'MNAC',  ja: '牛肉キャサバパン / レンジOK',          pt: 'Pão de Mandioca Assado Carne Desfiada', badge: 'レンジOK' },
      { code: 'FPDS',  ja: '冷凍塩パン / パンデサウ',              pt: 'Pão de Sal Congelado' },
      { code: 'FPHG2', ja: '冷凍ハンバーガーパン ゴマかけ 2個入り', pt: 'Pão Hamburguer Gergelim c/2 Congelado' },
      { code: 'FHD2',  ja: '冷凍ホットドッグ用パン 2個入り',        pt: 'Pão Hot Dog c/2 Congelado' },
      { code: 'FHD4',  ja: '冷凍ホットドッグ用パン 4個入り',        pt: 'Pão Hot Dog c/4 Congelado' },
      { code: 'FPI6',  ja: '冷凍ライ麦スライスパン 6枚',            pt: 'Pão Integral 6 Fatias Congelado' },
      { code: 'FPI18', ja: '冷凍ライ麦スライスパン 18枚',           pt: 'Pão Integral 18 Fatias Congelado' },
      { code: 'FPSV',  ja: '冷凍ソヴァドパン',                    pt: 'Pão Sovado Congelado' },
      { code: 'FPRC',  ja: '冷凍プレシャスクリームパン',            pt: 'Preciosa Congelado' },
      { code: 'FMSV',  ja: '冷凍ミニソヴァドパン',                 pt: 'Mini Sovado Congelado' },
      { code: 'FCGO',  ja: '冷凍グアバカタツムリ',                 pt: 'Caracol de Goiaba Congelado' },
      { code: 'FCCA',  ja: '冷凍シナモンロール',                   pt: 'Caracol de Canela Congelado' },
      { code: 'FDLC',  ja: '冷凍キャラメルソースパン',              pt: 'Pão com Doce de Leite Congelado' },
      { code: 'FCRN',  ja: '冷凍コーンパン 6個入り',               pt: 'Frozen Cornbread c/6' },
      { code: 'FLSG',  ja: '冷凍ここナッツスティクパン',            pt: 'Lingua de Sogra Congelado' },
      { code: 'FMMO',  ja: '冷凍ここナッツマシュマロー',            pt: 'Maria Mole Congelado' },
      { code: 'FRCO',  ja: '冷凍ここナッツリング',                  pt: 'Mini Rosca de Coco Congelado' },
      { code: 'FITN',  ja: '冷凍イタリアンパン',                   pt: 'Pão Italiano Congelado' },
      { code: 'FBFZ',  ja: '冷凍ここナッツソフトケーキ',            pt: 'Bolo Fazendeiro Congelado' },
      { code: 'FBFB',  ja: '冷凍コーンミールカステラ',              pt: 'Bolo de Fubá Congelado' },
    ],
  },
  {
    id: 'reizo',
    ja: '冷蔵パン',
    pt: 'Pães Refrigerados',
    emoji: '🧊',
    items: [
      { code: 'RBEIJ', ja: 'ここナッツミルクソフトキャンディー',    pt: 'Beijinho' },
      { code: 'RBRG',  ja: 'チョコスプレーソフトキャンデイ',        pt: 'Brigadeiro' },
      { code: 'RDLC',  ja: 'キャラメルソースパン',                  pt: 'Pão com Doce de Leite' },
      { code: 'RQJF',  ja: '冷凍ここナッツカップケーキ 3個入り',    pt: 'Queijadinha Congelado c/3' },
    ],
  },
  {
    id: 'salgados',
    ja: 'パステル・スナック',
    pt: 'Pastéis e Salgados',
    emoji: '🥟',
    items: [
      { code: 'ESCR',   ja: '生牛肉エスフィーハ',                  pt: 'Esfiha Crua de Carne' },
      { code: 'ESFA10', ja: '肉パン業務用 10個入り / レンジOK',    pt: 'Esfiha Assada de Carne c/10', badge: 'レンジOK' },
      { code: 'ESFA2',  ja: '牛肉パン 2個入り / レンジOK',         pt: 'Esfiha Assada c/2', badge: 'レンジOK' },
      { code: 'BZNH',   ja: '生ハムチーズパン バウル',              pt: 'Bauruzinho Presunto Queijo Tomate' },
      { code: 'CALZA',  ja: 'カルツォーネ ハムチーズ / レンジOK',  pt: 'Calzzone Assado Presunto e Queijo', badge: 'レンジOK' },
      { code: 'CALZC',  ja: '生チキンカルツォーネ',                 pt: 'Calzzone Cru Frango Catupiry' },
      { code: 'CALZP',  ja: '生ハムチーズカルツォーネ',             pt: 'Calzzone Cru Presunto e Queijo' },
      { code: 'CRSFR',  ja: '生クロワッサン チキンクリームチーズ',   pt: 'Croissant Frango Catupiry' },
      { code: 'CRSHP',  ja: '生クロワッサン ハムチーズ',            pt: 'Croissant Presunto e Queijo' },
      { code: 'BGBQ',   ja: '生バゲット ベーコン＆チーズ',          pt: 'Baguete Bacon Queijo' },
      { code: 'BGHP',   ja: '生バゲット ハムチーズ',               pt: 'Baguete Presunto e Queijo' },
      { code: 'PCML',   ja: '生パステル牛肉 L（予約のみ）',          pt: 'Pastel de Carne L', badge: '予約のみ' },
      { code: 'PCM',    ja: '生牛肉パステル M',                    pt: 'Pastel de Carne M' },
      { code: 'PFCL',   ja: '生チキンクリームチーズパステル L（予約のみ）', pt: 'Pastel Frango Catupiry L', badge: '予約のみ' },
      { code: 'PFCM',   ja: '生チキンクリームチーズパステル M',      pt: 'Pastel Frango Catupiry M' },
      { code: 'PPZL',   ja: '生ピッザパステル L（予約のみ）',        pt: 'Pastel de Pizza L', badge: '予約のみ' },
      { code: 'PPZ',    ja: '生ピッザパステル M',                   pt: 'Pastel de Pizza M' },
      { code: 'PQJL',   ja: '生チーズパステル L（予約のみ）',        pt: 'Pastel de Queijo L', badge: '予約のみ' },
      { code: 'PQJM',   ja: '生チーズパステル M',                  pt: 'Pastel de Queijo M' },
      { code: 'MASS',   ja: 'パステル生地 500g ロール',             pt: 'Massa de Pastel Rolo 500g' },
      { code: 'EMPA',   ja: 'エンパーダ チキンパイ M / レンジOK',  pt: 'Empada de Frango Assada M', badge: 'レンジOK' },
      { code: 'MPQJ',   ja: '生ミニパイパステル チーズ',            pt: 'Mini Pastel Queijo' },
      { code: 'MPC',    ja: '生ミニパイパステル 牛肉',              pt: 'Mini Pastel Carne' },
      { code: 'MPPZ',   ja: '生ミニパイパステル ピッザ味',           pt: 'Mini Pastel Pizza' },
      { code: 'MEMP',   ja: '生チキンミニエンパダパイ',              pt: 'Mini Empada Assada de Frango' },
      { code: 'PQJO50', ja: '生チーズパン 50g',                    pt: 'Pão de Queijo 50g' },
      { code: 'PQJO45', ja: '生チーズパン 45g',                    pt: 'Pão de Queijo 45g' },
      { code: 'PQJO40', ja: '生チーズパン 40g',                    pt: 'Pão de Queijo 40g' },
      { code: 'PQJ10',  ja: '生チーズパン 45g 10個入り',            pt: 'Pão de Queijo 45g Cru c/10' },
      { code: 'PQJA',   ja: '焼チーズパン 45g 10個入り / レンジOK', pt: 'Pão de Queijo Assado 45g c/10', badge: 'レンジOK' },
      { code: 'PQJA30', ja: '焼チーズパン 30g 限定 / レンジOK',    pt: 'Pão de Queijo Assado 30g (Limitado)', badge: '限定' },
      { code: 'PQJ20',  ja: '生チーズパン 40g 20個入り',            pt: 'Pão de Queijo Cru 40g 20un' },
      { code: 'PQJ100', ja: '生チーズパン 30g 100個入り',           pt: 'Pão de Queijo Cru 30g 100un' },
      { code: 'PQCAL',  ja: '生スモークソーセージチーズパン 50g',    pt: 'Pão de Queijo com Calabresa' },
      { code: 'COX10',  ja: '生チキンコロッケ 50g 10個入り',        pt: 'Coxinha M c/10' },
      { code: 'COXFR',  ja: 'チキンコロッケ揚げ立て冷凍 / レンジOK', pt: 'Coxinha Frita 25g x 6un', badge: 'レンジOK' },
      { code: 'COXM',   ja: '生チキンコロッケ M 25個入り',          pt: 'Coxinha M Granel 25un' },
      { code: 'COXL',   ja: '生チキンコロッケ Lサイズ',             pt: 'Coxinha L' },
      { code: 'KIBL',   ja: '生麦牛肉 キーベ Lサイズ',             pt: 'Kibe L' },
      { code: 'BPZL',   ja: '生ハムチーズコロッケ ピッザ L',        pt: 'Bolinho Pizza L' },
      { code: 'BQJL',   ja: '生チーズコロッケ Lサイズ',            pt: 'Bolinho de Queijo L' },
      { code: 'BCNL',   ja: '生牛肉コロッケ Lサイズ',              pt: 'Bolinho de Carne L' },
      { code: 'BCLQ',   ja: '生スモークソーセージチーズコロッケ',    pt: 'Croquete Calabresa e Queijo L' },
      { code: 'MCLG',   ja: '生スモークソーセージコロッケ業務用',    pt: 'Mini Bolinho Calabresa Granel' },
      { code: 'MCNG',   ja: '生牛肉ミニコロッケ業務用',             pt: 'Mini Bolinho de Carne Granel' },
      { code: 'MPZG',   ja: '生ハムチーズミニコロッケ ピッザ業務用', pt: 'Mini Bolinho de Pizza Granel' },
      { code: 'MQJG',   ja: '生チーズミニコロッケ業務用',           pt: 'Mini Bolinho de Queijo Granel' },
      { code: 'MKIBG',  ja: '生麦牛肉ミニコロッケ業務用',           pt: 'Mini Kibe Granel' },
      { code: 'MCXG',   ja: '生チキンミニコロッケ業務用',           pt: 'Mini Coxinha Granel' },
      { code: 'MCX15',  ja: '生ミニチキンコロッケ 15個入り',        pt: 'Mini Coxinha c/15' },
      { code: 'MKB15',  ja: '生ミニ牛肉麦コロッケ 15個入り',        pt: 'Mini Kibe c/15' },
      { code: 'MCN15',  ja: '生ミニ牛肉コロッケ 15個入り',          pt: 'Mini Bolinho de Carne c/15' },
      { code: 'MQJ15',  ja: '生ミニチーズコロッケ 15個入り',        pt: 'Mini Bolinho de Queijo c/15' },
      { code: 'MCL15',  ja: '生ミニコロッケ スモークソーセージチーズ 15個入り', pt: 'Mini Bolinho Calabresa e Queijo c/15' },
      { code: 'MPZ15',  ja: '生ミニハムチーズコロッケ ピッザ 15個入り', pt: 'Mini Bolinho de Pizza c/15' },
      { code: 'CHRS',   ja: '生ミニチュロス 100個入り',             pt: 'Mini Churros c/100' },
      { code: 'MAND',   ja: 'キャサバいも 400g',                   pt: 'Mandioca Pré Cozida 400g' },
    ],
  },
  {
    id: 'bolos',
    ja: 'ケーキ・スイーツ',
    pt: 'Bolos e Doces',
    emoji: '🎂',
    items: [
      { code: 'BCOC',  ja: 'ここナッツチョコケーキ 280g',          pt: 'Bolo Prestígio Nude 280g' },
      { code: 'BAB',   ja: 'パイナップルケーキ 280g',              pt: 'Bolo de Abacaxi Nude 280g' },
      { code: 'BDL',   ja: 'キャラメルクリームケーキ 280g',        pt: 'Bolo Doce de Leite Nude 280g' },
      { code: 'BBR',   ja: 'チョコスプレーケーキ 280g',            pt: 'Bolo Brigadeiro Nude 280g' },
      { code: 'BNO',   ja: 'クルミクリームケーキ 280g',            pt: 'Bolo de Nozes Nude 280g' },
      { code: 'BAMU',  ja: 'キャラメル＆プルンケーキ 280g',        pt: 'Bolo de Ameixa Nude 280g' },
      { code: 'BDLP',  ja: 'キャラメルケーキ カップ',              pt: 'Bolo Doce de Leite Pote' },
      { code: 'BBRP',  ja: 'チョコスプレービッグカップ',            pt: 'Bolo Brigadeiro Pote' },
      { code: 'BACP',  ja: 'パイナップルここナッツケーキ',          pt: 'Bolo Abacaxi com Coco Pote' },
      { code: 'BGLC',  ja: '冷やしここナッツケーキ',               pt: 'Bolo Gelado de Coco' },
      { code: 'BGLCH', ja: '冷やしチョコケーキ',                   pt: 'Bolo Gelado de Chocolate' },
      { code: 'BGLMK', ja: 'みかんジェラートケーキ',               pt: 'Bolo Gelado de Mikan' },
      { code: 'BBFZ',  ja: '常温ここナッツソフトケーキ',            pt: 'Bolo Fazendeiro' },
      { code: 'CUR',   ja: 'コーンプリン',                        pt: 'Curau' },
      { code: 'QUI',   ja: '卵プリン',                            pt: 'Quindim' },
      { code: 'PUD',   ja: 'ミルクプリン',                        pt: 'Pudim de Leite' },
      { code: 'BEIC',  ja: 'ここナッツソフトキャンディー',          pt: 'Beijinho Congelado' },
      { code: 'BRGC',  ja: 'チョコスプレーソフトキャンディー',      pt: 'Brigadeiro Congelado' },
    ],
  },
  {
    id: 'picoles',
    ja: 'アイスバー / ピコレ',
    pt: 'Picolés / Sorvetes',
    emoji: '🍦',
    items: [
      { code: 'PMLH50', ja: 'コーンアイスバー 50個入り',           pt: 'Picolé de Milho 50' },
      { code: 'PMLH25', ja: 'コーンアイスキャンディ 25個入り',     pt: 'Picolé de Milho 25' },
      { code: 'PCOC50', ja: 'ここナッツアイスバー 50個入り',       pt: 'Picolé de Coco 50' },
      { code: 'PCOC25', ja: 'ここナッツアイスキャンディ 25個入り', pt: 'Picolé de Coco 25' },
      { code: 'PCOQ50', ja: '焼きここナッツアイスバー 50個入り',   pt: 'Picolé de Coco Queimado 50' },
      { code: 'PCOQ25', ja: '焼きここナッツアイスキャンディ 25個入り', pt: 'Picolé de Coco Queimado 25' },
      { code: 'PAB50',  ja: 'パイナップルアイスバー 50個入り',     pt: 'Picolé de Abacaxi 50' },
      { code: 'PAB25',  ja: 'パイナップルアイスバー 25個入り',     pt: 'Picolé de Abacaxi 25' },
      { code: 'PCHO50', ja: 'チョコアイスバー 50個入り',           pt: 'Picolé de Chocolate 50' },
      { code: 'PCHO25', ja: 'チョコアイスバー 25個入り',           pt: 'Picolé de Chocolate 25' },
      { code: 'PGRO50', ja: 'グロゼイユアイスバー 50個入り',       pt: 'Picolé de Groselha 50' },
      { code: 'PGRO25', ja: 'グロゼイユアイスバー 25個入り',       pt: 'Picolé de Groselha 25' },
      { code: 'PLIM50', ja: 'レモンアイスバー 50個入り',           pt: 'Picolé de Limão 50' },
      { code: 'PLIM25', ja: 'レモンアイスバー 25個入り',           pt: 'Picolé de Limão 25' },
      { code: 'PMRC50', ja: 'パッションフルーツアイスバー 50個入り', pt: 'Picolé de Maracujá 50' },
      { code: 'PMRC25', ja: 'パッションフルーツアイスバー 25個入り', pt: 'Picolé de Maracujá 25' },
      { code: 'PMOR50', ja: 'イチゴアイスバー 50個入り',           pt: 'Picolé de Morango 50' },
      { code: 'PMOR25', ja: 'イチゴアイスバー 25個入り',           pt: 'Picolé de Morango 25' },
      { code: 'PMNG50', ja: 'マンゴアイスバー 50個入り',           pt: 'Picolé de Manga 50' },
      { code: 'PMNG25', ja: 'マンゴアイスバー 25個入り',           pt: 'Picolé de Manga 25' },
      { code: 'PUVA50', ja: 'グレープアイスバー 50個入り',         pt: 'Picolé de Uva 50' },
      { code: 'PUVA25', ja: 'グレープアイスバー 25個入り',         pt: 'Picolé de Uva 25' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: ROW DE PRODUTO
// ─────────────────────────────────────────────────────────────────────────────
function ProductRow({
  item, qty, locale,
  onChange,
}: { item: Product; qty: number; locale: string; onChange: (v: number) => void }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-2.5 border-b border-gray-100 last:border-0 transition-colors ${qty > 0 ? 'bg-orange-50/60' : 'bg-white'}`}>
      
      {/* Nome */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug">
          {locale === 'ja' ? item.ja : item.pt}
        </p>
        {locale === 'ja' && (
          <p className="text-[11px] text-gray-400 leading-tight">{item.pt}</p>
        )}
        {item.badge && (
          <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            item.badge === '予約のみ' || item.badge === '限定'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {item.badge}
          </span>
        )}
      </div>

      {/* Controles de quantidade */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button type="button" onClick={() => onChange(Math.max(0, qty - 1))} disabled={qty === 0}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 text-base hover:border-orange-400 hover:text-orange-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
          −
        </button>
        <input
          type="number" min={0} max={99999} value={qty === 0 ? '' : qty} placeholder="0"
          onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className={`w-14 text-center border rounded-lg py-1 text-sm font-semibold outline-none transition-all ${
            qty > 0 ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 bg-gray-50 text-gray-600'
          } focus:border-orange-500 focus:bg-white`}
        />
        <button type="button" onClick={() => onChange(qty + 1)}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 text-base hover:border-orange-400 hover:text-orange-600 transition-all">
          +
        </button>
        <span className="text-[11px] text-gray-400 w-5 text-center">{locale === 'ja' ? '個' : 'un'}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: CATEGORIA ACCORDION
// ─────────────────────────────────────────────────────────────────────────────
function CategoryAccordion({
  cat, quantities, locale, onChange,
}: { cat: Category; quantities: Record<string, number>; locale: string; onChange: (code: string, v: number) => void }) {
  const [open, setOpen] = useState(cat.id === 'joton');
  const selCount = cat.items.filter(i => (quantities[i.code] || 0) > 0).length;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button type="button" onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${open ? 'bg-orange-50' : 'bg-white hover:bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{cat.emoji}</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{locale === 'ja' ? cat.ja : cat.pt}</p>
            <p className="text-xs text-gray-400">{cat.items.length} {locale === 'ja' ? '種類' : 'produtos'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
              {selCount}
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="max-h-[480px] overflow-y-auto">
          {cat.items.map(item => (
            <ProductRow
              key={item.code} item={item} qty={quantities[item.code] || 0}
              locale={locale} onChange={v => onChange(item.code, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMPO DE FORMULÁRIO
// ─────────────────────────────────────────────────────────────────────────────
function Field({ label, error, icon: Icon, children, required = false, span2 = false }: {
  label: string; error?: string; icon: any; children: React.ReactNode; required?: boolean; span2?: boolean;
}) {
  return (
    <div className={span2 ? 'sm:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full pl-10 pr-4 py-3 border rounded-xl outline-none text-sm transition-all ${
    err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white'
  }`;

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function OrderBusinessPage() {
  const locale = useLocale();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ company: '', contact: '', email: '', phone: '', customerNo: '', deliveryDate: '', notes: '', privacy: false });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setF = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));
  const setQty = (code: string, val: number) => setQuantities(p => ({ ...p, [code]: val }));

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const selected = CATALOG.flatMap(g =>
    g.items.filter(i => (quantities[i.code] || 0) > 0)
           .map(i => ({ ...i, qty: quantities[i.code], cat: locale === 'ja' ? g.ja : g.pt }))
  );

  const ja = locale === 'ja';

  const validate = () => {
    const errs: Record<string, string> = {};
    const req = ja ? '必須項目です' : 'Obrigatório';
    if (!form.company)     errs.company     = req;
    if (!form.contact)     errs.contact     = req;
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = ja ? '有効なメールアドレス' : 'E-mail inválido';
    if (!form.phone)       errs.phone       = req;
    if (!form.customerNo)  errs.customerNo  = req;
    if (!form.deliveryDate)errs.deliveryDate= req;
    if (!form.privacy)     errs.privacy     = ja ? '同意が必要です' : 'Aceite a política';
    if (totalItems === 0)  errs.products    = ja ? '商品を1つ以上選択してください' : 'Selecione ao menos 1 produto';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');

    try {
      const res = await fetch('/api/orders/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, products: selected, total: totalItems, locale }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail || `HTTP ${res.status}`);
      }

      setStatus('success');
    } catch (err) {
      console.error('[ORDER SUBMIT ERROR]', err);
      setStatus('idle');
      setErrors({
        submit: locale === 'ja'
          ? '送信中にエラーが発生しました。しばらくしてから再度お試しください。'
          : 'Erro ao enviar o pedido. Tente novamente ou entre em contato pelo telefone.',
      });
    }
  };

  const reset = () => {
    setStatus('idle');
    setQuantities({});
    setForm({ company: '', contact: '', email: '', phone: '', customerNo: '', deliveryDate: '', notes: '', privacy: false });
    setErrors({});
  };

  // ── SUCESSO ──────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-abril text-3xl text-gray-900 mb-3">
            {ja ? 'ご注文を承りました！' : 'Pedido Recebido!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {ja ? 'ありがとうございます。担当者より確認のご連絡をいたします。' : 'Obrigado! Entraremos em contato para confirmar.'}
          </p>

          {selected.length > 0 && (
            <div className="bg-beige-50 rounded-2xl p-4 text-left mb-6 max-h-64 overflow-y-auto">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                {ja ? '注文商品一覧' : 'Produtos Pedidos'}
              </p>
              {selected.map(p => (
                <div key={p.code} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700 text-xs leading-snug">{ja ? p.ja : p.pt}</span>
                  <span className="font-bold text-orange-600 ml-4 flex-shrink-0 text-xs">×{p.qty}</span>
                </div>
              ))}
            </div>
          )}

          <button onClick={reset} className="btn-orange w-full justify-center text-base">
            {ja ? '新規注文を作成' : 'Novo Pedido'}
          </button>
        </div>
      </div>
    );
  }

  // ── FORMULÁRIO ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col bg-white">

      {/* HERO */}
      <section className="bg-beige-50 py-12 lg:py-20 border-b border-gray-100">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <Building2 className="w-3.5 h-3.5" />
            {ja ? '法人専用' : 'EXCLUSIVO B2B'}
          </div>
          <h1 className="font-abril text-3xl lg:text-5xl text-gray-900 mb-4">
            {ja ? '法人注文フォーム' : 'Formulário de Pedido Corporativo'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-5">
            {ja ? 'スマホやパソコンからWEBで簡単にご注文いただけます。' : 'Faça seu pedido de forma rápida e prática pelo celular ou computador.'}
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 max-w-2xl mx-auto text-sm text-orange-900 text-left space-y-1">
            <p>
              {ja
                ? '※法人のリピーター様専用の注文フォームです。初めての法人のお客様は、ご注文前に当社へお問い合わせください。'
                : '※Exclusivo para clientes corporativos cadastrados. Novos clientes devem entrar em contato antes.'}
            </p>
            <p>
              {ja
                ? '※個人のお客様は、楽天ショップよりご注文ください。'
                : '※Clientes individuais devem usar a Rakuten.'}
            </p>
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="py-12 lg:py-16">
        <div className="container-custom max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px] items-start">

            {/* COLUNA PRINCIPAL */}
            <div className="space-y-10">

              {/* PRODUTOS */}
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <ShoppingCart className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-900">
                    {ja ? 'ご希望商品' : 'Produtos Desejados'}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mb-5">
                  {ja ? '※各ご希望商品の注文個数は、半角数字で入力してください。' : '※Digite a quantidade desejada de cada produto.'}
                </p>

                {errors.products && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{errors.products}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {CATALOG.map(cat => (
                    <CategoryAccordion
                      key={cat.id} cat={cat} quantities={quantities}
                      locale={locale} onChange={setQty}
                    />
                  ))}
                </div>
              </div>

              {/* INFORMAÇÕES DO CLIENTE */}
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <User className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-900">
                    {ja ? 'お客様情報など' : 'Informações do Cliente'}
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Field label={ja ? '会社名・団体名など' : 'Empresa / Organização'} error={errors.company} icon={Building2} required span2>
                    <input type="text" value={form.company}
                      onChange={e => setF('company', e.target.value)}
                      placeholder={ja ? '株式会社 〇〇' : 'Real Pan Ltda.'}
                      className={inputCls(errors.company)} />
                  </Field>

                  <Field label={ja ? '担当者名' : 'Responsável'} error={errors.contact} icon={User} required>
                    <input type="text" value={form.contact}
                      onChange={e => setF('contact', e.target.value)}
                      placeholder={ja ? '山田 太郎' : 'Nome Completo'}
                      className={inputCls(errors.contact)} />
                  </Field>

                  <Field label={ja ? 'お客様番号' : 'Nº do Cliente'} error={errors.customerNo} icon={Hash} required>
                    <input type="text" value={form.customerNo}
                      onChange={e => setF('customerNo', e.target.value)}
                      placeholder="00000"
                      className={inputCls(errors.customerNo)} />
                  </Field>

                  <Field label={ja ? 'メールアドレス' : 'E-mail'} error={errors.email} icon={Mail} required>
                    <input type="email" value={form.email}
                      onChange={e => setF('email', e.target.value)}
                      placeholder="exemplo@empresa.co.jp"
                      className={inputCls(errors.email)} />
                  </Field>

                  <Field label={ja ? '電話番号' : 'Telefone'} error={errors.phone} icon={Phone} required>
                    <input type="tel" value={form.phone}
                      onChange={e => setF('phone', e.target.value)}
                      placeholder="053-000-0000"
                      className={inputCls(errors.phone)} />
                  </Field>

                  <Field label={ja ? 'お届け希望日' : 'Data de Entrega Desejada'} error={errors.deliveryDate} icon={Calendar} required span2>
                    <input type="date" value={form.deliveryDate}
                      onChange={e => setF('deliveryDate', e.target.value)}
                      min={new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]}
                      className={inputCls(errors.deliveryDate)} />
                    <p className="mt-1 text-xs text-gray-400">
                      {ja ? '※お支払い方法やお届け先は、契約時にご指定いただいたものをご利用いたします。' : '※Pagamento e endereço conforme contrato cadastrado.'}
                    </p>
                  </Field>

                  {/* Observações */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {ja ? '備考' : 'Observações'}
                    </label>
                    <textarea value={form.notes} rows={3}
                      onChange={e => setF('notes', e.target.value)}
                      placeholder={ja ? 'ご注文に関するご要望などがございましたらご記入ください' : 'Requisitos especiais, observações do pedido, etc.'}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:border-orange-400 bg-gray-50 focus:bg-white resize-none transition-all"
                    />
                  </div>
                </div>

                {/* Privacidade */}
                <div className="mt-6">
                  <div className={`rounded-xl border p-4 ${errors.privacy ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      {ja ? '■ 個人情報の取り扱いについて' : '■ Política de Privacidade'}
                    </p>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      {ja
                        ? 'このフォームにご記入いただきました個人情報は、回答を目的として使用します。この個人情報は、ご本人の承諾なしに第三者（当社業務委託先を除く）に提供することはありません。'
                        : 'As informações fornecidas neste formulário serão usadas apenas para processar seu pedido e não serão compartilhadas com terceiros sem sua autorização.'}
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.privacy}
                        onChange={e => setF('privacy', e.target.checked)}
                        className="w-4 h-4 accent-orange-500" />
                      <span className="text-sm font-medium text-gray-800">
                        {ja ? '個人情報保護方針に同意する' : 'Concordo com a Política de Privacidade'}
                        {' — '}
                        <a href={`/${locale}/privacy`} target="_blank" className="text-orange-600 hover:underline">
                          {ja ? '個人情報保護方針はこちら' : 'Ver política'}
                        </a>
                      </span>
                    </label>
                  </div>
                  {errors.privacy && <p className="mt-1 text-xs text-red-500">{errors.privacy}</p>}
                </div>
              </div>
            </div>

            {/* SIDEBAR STICKY */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-gray-900 rounded-3xl p-6 text-white">
                <h3 className="font-abril text-xl mb-4 tracking-wide">
                  {ja ? '注文サマリー' : 'Resumo do Pedido'}
                </h3>

                {totalItems === 0 ? (
                  <div className="py-8 text-center">
                    <ShoppingCart className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      {ja ? '商品が選択されていません' : 'Nenhum produto selecionado'}
                    </p>
                  </div>
                ) : (
                  <div className="max-h-56 overflow-y-auto scrollbar-hide mb-4 space-y-0">
                    {selected.map(p => (
                      <div key={p.code} className="flex justify-between items-start gap-2 py-2 border-b border-white/10 last:border-0">
                        <span className="text-gray-300 text-xs leading-snug">{ja ? p.ja : p.pt}</span>
                        <span className="text-orange-400 font-bold text-sm flex-shrink-0">×{p.qty}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 mb-5">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{ja ? '商品種類' : 'Tipos'}</span>
                    <span>{selected.length}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-300">{ja ? '合計数量' : 'Total'}</span>
                    <span className="text-orange-400">{totalItems} {ja ? '個' : 'un'}</span>
                  </div>
                </div>

                <button type="submit" disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                  {status === 'sending' ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />{ja ? '送信中...' : 'Enviando...'}</>
                  ) : (
                    <>{ja ? '注文を送信する' : 'Enviar Pedido'}<ArrowRight className="w-5 h-5" /></>
                  )}
                </button>

                {errors.submit && (
                  <div className="flex items-start gap-2 bg-red-900/20 border border-red-500/30 rounded-xl p-3 mt-3">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300 leading-relaxed">{errors.submit}</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </form>

    </div>
  );
}