# Design Direction

## Visual

- 4枚目の黄色系を採用
- 左上のキャラクター要素は使わない
- Nani/Zennのような軽い日本製Webサービス感を参考にするが、青ベースは避ける
- 色は pale lemon / white / charcoal / warm yellow を中心にする

## Product

目的は、ギター練習中に脳の負荷を増やさず、欲しいコード情報へすぐ届くこと。

## Navigation

下部固定ナビはWebサイトでも実装可能。CSSの `position: fixed` と `env(safe-area-inset-bottom)` でiPhoneのホームバー領域にも対応する。

## MVP Screens

- 検索: `Eaug` などをすぐ表示
- キー: `Cメジャー` のダイアトニックを重複少なく表示
- 判定: `ドミソ` などの構成音から候補を表示
