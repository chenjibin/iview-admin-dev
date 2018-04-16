<template>
    <div class="article-detail">
        <div class="inner">
            <div class="ver-btn">
                <div class="zan-btn" @click.stop="$router.go(-1)">
                    <div class="icon-wrapper" style="background-color: #ddd;color: #666;">
                        <Icon type="ios-undo"></Icon>
                    </div>
                    <div class="text" style="color: #666;">返回</div>
                </div>
                <div class="zan-btn">
                    <div class="icon-wrapper">
                        <Icon type="thumbsup"></Icon>
                    </div>
                    <div class="text">80</div>
                </div>
            </div>
            <h2 class="title">测试文章标题</h2>
            <div class="main-content" v-html="html"></div>
            <div class="comment-block">
                <div class="top">
                    <span class="number">12条评论</span>
                </div>
                <div class="your-comment">
                    <wang-editor
                            :menus="editorMeun"
                            :min-height="64"
                            :defaul-text="defaultText"
                            :editorcontent.sync="editorContent"></wang-editor>
                    <div class="btn-group" style="text-align: right">
                        <Button type="primary" @click="replyHandler">评论</Button>
                    </div>
                </div>
                <div class="list">
                    <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
                    <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
                    <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    .article-detail {
        padding-top: 20px;
        padding-bottom: 100px;
        background-color: #fff;
        min-height: 2000px;
        .inner {
            width: 690px;
            margin: 0 auto;
            .ver-btn {
                position: fixed;
                left: 0;
                right: 0;
                width: 884px;
                height: 0;
                pointer-events: none;
                margin: auto;
                top: 106px;
                .zan-btn {
                    display: block;
                    width: 48px;
                    color: #8590a6;
                    line-height: 1.14286;
                    font-size: 14px;
                    margin-bottom: 20px;
                    pointer-events: auto;
                    transition: color .3s;
                    text-align: center;
                    cursor: pointer;
                    &:hover .icon-wrapper {
                        background: rgba(0,132,255,.15);
                        transform: scale(1.1);
                    }
                    &:hover .text {
                        transform: translateY(4px);
                    }
                    .icon-wrapper {
                        border-radius: 50%;
                        width: 48px;
                        height: 48px;
                        line-height: 48px;
                        background-color: rgba(0,132,255,.1);
                        color: #0084ff;
                        font-size: 26px;
                        will-change: transform;
                        transition: -webkit-transform .3s;
                        transition: transform .3s;
                        transition: transform .3s,-webkit-transform .3s;
                    }
                    .text {
                        margin-top: 8px;
                        height: 16px;
                        overflow: hidden;
                        color: #0084ff;
                        transition: -webkit-transform .3s;
                        transition: transform .3s;
                        transition: transform .3s,-webkit-transform .3s;
                    }
                }
            }
            .title {
                margin-bottom: 20px;
                font-size: 24px;
            }
            .main-content {
                font-size: 16px;
            }
            .comment-block {
                margin-top: 16px;
                .top {
                    padding: 16px 8px 0;
                    .number {
                        font-size: 16px;
                        font-weight: 700;
                    }
                }
                .your-comment {
                    margin-top: 16px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #ddd;
                }
            }
        }
    }
</style>
<script>
    import FsCommentList from '@/baseComponents/fs-comment-list';
    import WangEditor from '@/baseComponents/fs-wangeditor';
    export default {
        name: 'articleDetail',
        data () {
            return {
                editorMeun: [
                    'emoticon'
                ],
                defaultText: '写下你的评论...',
                img: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
                name: '大田集',
                commentContent: '😂 去年重构一个老项目，想用babel来搞，被babel文档虐得死去活来，最后还是看不懂',
                commentTime: '7天前',
                html: '<div class="RichText Post-RichText" data-reactid="70"><h2>前言</h2><p>在 html 中使用 checkbox 时，可能会由于默认 checkbox 的样式不符合页面风格，或是在不同浏览器样式不同而需要自定义。</p><p>常见的自定义 checkbox 的方法有：</p><ul><li>为不同状态的 checkbox 定义不同的背景图。</li><li>定义 CSS 的 before、after，设置 font-icon 或通过 CSS 样式的方式来模拟 checkbox 的几种状态。</li></ul><p>第一种方式，使用起来比较简单，但是需要增加对图片资源的引用，略微延长加载时间，并且无法方便的实现样式的定制和修改。</p><p>第二种方式则略优一些，定制起来较为方便，但是 before 和 after 只有两个元素，对于样式复杂的 checkbox，绘制起来可能会捉襟见肘；同时，部分浏览器不支持在 checkbox 中定义 before、after，这样就需要增加额外的 dom 结构。</p><p>对于上面的两个问题，使用 Houdini 提供的功能实现自定义 checkbox 则可以完美解决。在开始编写代码之前，先简单介绍一下 Houdini。</p><h2>什么是 Houdini ？</h2><p>CSS Houdini 是一个新的 W3C 工作组，志在通过提供一系列 API，使开发者能够拥有访问 CSS 引擎的能力，可以不局限于原来的 CSS 属性，有能力创建自定义的 CSS 特性并高效的使用在浏览器中；同时，Houdini 的出现使得浏览器的行为得到统一，新特性能够更快的使用到项目中。</p><blockquote>通过浏览这篇<a href="https://link.zhihu.com/?target=https%3A//drafts.css-houdini.org/" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">草案</a>，我们可以了解到关于 CSS Houdini 的详细内容。</blockquote><p>下面介绍一下在自定义 checkbox 时需要用到的 API：</p><p><b>CSS Painting API</b></p><p>如果你熟悉了在 canvas 中绘图，那么使用这个 API 对你来说就不陌生了。Painting API 提供了为 CSS 属性绘图的能力，可以将其应用到 mask-image、background-image、list-style-image、border-image 中。</p><div class="highlight"><pre><code class="language-js"><span></span><span class="kr">class</span> <span class="nx">Checkbox</span> <span class="p">{</span>\n' +
                '  <span class="kr">static</span> <span class="nx">get</span> <span class="nx">inputArguments</span><span class="p">()</span> <span class="p">{</span> <span class="k">return</span> <span class="p">[</span><span class="s1">\'&lt;length&gt;\'</span><span class="p">]</span> <span class="p">}</span>\n' +
                '\n' +
                '  <span class="kr">static</span> <span class="nx">get</span> <span class="nx">inputProperties</span><span class="p">()</span> <span class="p">{</span> <span class="k">return</span> <span class="p">[</span><span class="s1">\'--color\'</span><span class="p">]</span> <span class="p">}</span>\n' +
                '\n' +
                '  <span class="nx">paint</span> <span class="p">(</span><span class="nx">ctx</span><span class="p">,</span> <span class="nx">size</span><span class="p">,</span> <span class="nx">styleMap</span><span class="p">,</span> <span class="nx">args</span><span class="p">)</span> <span class="p">{</span>\n' +
                '    <span class="c1">// ...</span>\n' +
                '  <span class="p">}</span>\n' +
                '<span class="p">}</span>\n' +
                '<span class="nx">registerPaint</span><span class="p">(</span><span class="s1">\'checkbox\'</span><span class="p">,</span> <span class="nx">Checkbox</span><span class="p">)</span>\n' +
                '\n' +
                '<span class="c1">// .a { background-image: paint(checkbox, 1px) }</span>\n' +
                '</code></pre></div><p>绘制主要在 paint 函数中完成，paint 函数有四个参数，分别是：</p><ul><li>ctx：PaintRenderingContext2D，是 CanvasRenderingContext2D 的一个子集，实现了 canvas 的大部分功能。</li><li>size：PaintSize，包括元素的宽高信息。</li><li>styleMap：StylePropertyMapReadOnly，可以通过这个参数来获取 CSS 变量或其他信息。</li><li>args：来自 CSS 中传递的参数。</li></ul><p><b>CSS Properties and Values API</b></p><p>通过这个 API，开发者可以对 CSS 变量定义类型、继承行为和初始值，从而可以使用 CSS 变量制作一些动态效果。</p><div class="highlight"><pre><code class="language-js"><span></span><span class="nx">CSS</span><span class="p">.</span><span class="nx">registerProperty</span><span class="p">({</span>\n' +
                '  <span class="nx">name</span><span class="o">:</span> <span class="s2">"--my-color"</span><span class="p">,</span>\n' +
                '  <span class="nx">syntax</span><span class="o">:</span> <span class="s2">"&lt;color&gt;"</span><span class="p">,</span>\n' +
                '  <span class="nx">inherits</span><span class="o">:</span> <span class="kc">false</span><span class="p">,</span>\n' +
                '  <span class="nx">initialValue</span><span class="o">:</span> <span class="s2">"#fff"</span>\n' +
                '<span class="p">});</span>\n' +
                '</code></pre></div><p>syntax 声明了引擎需要如何解析这个 CSS 变量，可以设置的值有：length、number、percentage、length-percentage、color、angle 等。</p><p><b>Worklets</b></p><p>使用 Painting API 时，为了绘制图像，需要撰写 JS 文件，这个 JS 文件并不是通过常规的 Web 嵌入 JS 的方式引入，而是使用如下的方式，通过 Worklets 引入该文件。</p><div class="highlight"><pre><code class="language-text"><span></span>CSS.paintWorklet.addModule(\'checkbox.js\')\n' +
                '</code></pre></div><p>你可能会觉得这种方式很像 Web Workers，引用 Web Workers 文档中的一段文字：</p><blockquote>Workers (as these background scripts are called herein) are relatively heavy-weight, and are not intended to be used in large numbers. For example, it would be inappropriate to launch one worker for each pixel of a four megapixel image. The examples below show some appropriate uses of workers.</blockquote><p>可以看出，Web Workers 并不适合应用在此处。Worklets 与 Web Workers 十分相似，使用独立于主线程的方式，同时具有轻量及生命周期短的特点。</p><h2>支持性</h2><figure><noscript>&lt;img src="https://pic1.zhimg.com/v2-fe565f850e9a2eb6bc411df875d7a622_b.jpg" data-caption="" data-size="normal" data-rawwidth="735" data-rawheight="655" class="origin_image zh-lightbox-thumb" width="735" data-original="https://pic1.zhimg.com/v2-fe565f850e9a2eb6bc411df875d7a622_r.jpg"&gt;</noscript><img src="https://pic1.zhimg.com/80/v2-fe565f850e9a2eb6bc411df875d7a622_hd.jpg" data-caption="" data-size="normal" data-rawwidth="735" data-rawheight="655" class="origin_image zh-lightbox-thumb lazy" width="735" data-original="https://pic1.zhimg.com/v2-fe565f850e9a2eb6bc411df875d7a622_r.jpg" data-actualsrc="https://pic1.zhimg.com/v2-fe565f850e9a2eb6bc411df875d7a622_b.jpg"></figure><p>查看 Houdini 的支持性可以到 <a href="https://link.zhihu.com/?target=https%3A//ishoudinireadyyet.com/" class=" external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043"><span class="invisible">https://</span><span class="visible">ishoudinireadyyet.com/</span><span class="invisible"></span></a> ，截止笔者发布这篇文章，下文用到的特性已经全部被最新版本的 Chrome 支持。</p><h2>如何使用 Houdini 实现自定义 checkbox</h2><p>checkbox 共有 6 种状态，分别为 checked、unchecked、indeterminate，以及分别对应的 disabled 状态。首先实现 unchecked 及 unchecked disabled，使用 CSS Painting API 绘制样式，并将其赋给 background-image。</p><div class="highlight"><pre><code class="language-html"><span></span><span class="cp">&lt;!DOCTYPE html&gt;</span>\n' +
                '<span class="p">&lt;</span><span class="nt">html</span> <span class="na">lang</span><span class="o">=</span><span class="s">"en"</span><span class="p">&gt;</span>\n' +
                '<span class="p">&lt;</span><span class="nt">head</span><span class="p">&gt;</span>\n' +
                '  <span class="p">&lt;</span><span class="nt">title</span><span class="p">&gt;</span>Houdini<span class="p">&lt;/</span><span class="nt">title</span><span class="p">&gt;</span>\n' +
                '  <span class="p">&lt;</span><span class="nt">style</span><span class="p">&gt;</span>\n' +
                '    <span class="nc">.custom-checkbox</span> <span class="p">{</span>\n' +
                '      <span class="o">-</span><span class="n">webkit</span><span class="o">-</span><span class="n">appearance</span><span class="o">:</span> <span class="nb">none</span><span class="p">;</span>\n' +
                '      <span class="nb">width</span><span class="o">:</span> <span class="m">100px</span><span class="p">;</span>\n' +
                '      <span class="nb">height</span><span class="o">:</span> <span class="m">100px</span><span class="p">;</span>\n' +
                '      <span class="nb">background-image</span><span class="o">:</span> <span class="n">paint</span><span class="p">(</span><span class="n">checkbox</span><span class="p">);</span>\n' +
                '      <span class="nb">outline</span><span class="o">:</span> <span class="m">0</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="n">status</span><span class="o">:</span> <span class="n">unchecked</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="nb">border-color</span><span class="o">:</span> <span class="m">#dcdfe6</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="n">bg</span><span class="o">-</span><span class="nb">color</span><span class="o">:</span> <span class="m">#fff</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="n">line</span><span class="o">-</span><span class="nb">color</span><span class="o">:</span> <span class="m">#fff</span><span class="p">;</span>\n' +
                '    <span class="p">}</span>\n' +
                '    <span class="nc">.custom-checkbox</span><span class="nd">:checked</span> <span class="p">{</span>\n' +
                '      <span class="o">--</span><span class="n">status</span><span class="o">:</span> <span class="n">checked</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="n">bg</span><span class="o">-</span><span class="nb">color</span><span class="o">:</span> <span class="m">#409eff</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="n">line</span><span class="o">-</span><span class="nb">color</span><span class="o">:</span> <span class="m">#fff</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="nb">border-color</span><span class="o">:</span> <span class="m">#fff</span><span class="p">;</span>\n' +
                '    <span class="p">}</span>\n' +
                '    <span class="nc">.custom-checkbox</span><span class="nd">:indeterminate</span> <span class="p">{</span>\n' +
                '      <span class="o">--</span><span class="n">status</span><span class="o">:</span> <span class="n">indeterminate</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="n">bg</span><span class="o">-</span><span class="nb">color</span><span class="o">:</span> <span class="m">#409eff</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="n">line</span><span class="o">-</span><span class="nb">color</span><span class="o">:</span> <span class="m">#fff</span><span class="p">;</span>\n' +
                '    <span class="p">}</span>\n' +
                '    <span class="nc">.custom-checkbox</span><span class="nd">:disabled</span> <span class="p">{</span>\n' +
                '      <span class="o">--</span><span class="n">disabled</span><span class="o">:</span> <span class="n">disabled</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="n">bg</span><span class="o">-</span><span class="nb">color</span><span class="o">:</span> <span class="m">#edf2fc</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="n">line</span><span class="o">-</span><span class="nb">color</span><span class="o">:</span> <span class="m">#c0c4cc</span><span class="p">;</span>\n' +
                '      <span class="o">--</span><span class="nb">border-color</span><span class="o">:</span> <span class="m">#dcdfe6</span><span class="p">;</span>\n' +
                '    <span class="p">}</span>\n' +
                '  <span class="p">&lt;/</span><span class="nt">style</span><span class="p">&gt;</span>\n' +
                '<span class="p">&lt;/</span><span class="nt">head</span><span class="p">&gt;</span>\n' +
                '<span class="p">&lt;</span><span class="nt">body</span><span class="p">&gt;</span>\n' +
                '  <span class="p">&lt;</span><span class="nt">input</span> <span class="na">type</span><span class="o">=</span><span class="s">"checkbox"</span> <span class="na">class</span><span class="o">=</span><span class="s">"custom-checkbox"</span><span class="p">&gt;</span>\n' +
                '  <span class="p">&lt;</span><span class="nt">input</span> <span class="na">type</span><span class="o">=</span><span class="s">"checkbox"</span> <span class="na">disabled</span> <span class="na">class</span><span class="o">=</span><span class="s">"custom-checkbox"</span><span class="p">&gt;</span>\n' +
                '  <span class="p">&lt;</span><span class="nt">script</span><span class="p">&gt;</span>\n' +
                '    <span class="nx">CSS</span><span class="p">.</span><span class="nx">paintWorklet</span><span class="p">.</span><span class="nx">addModule</span><span class="p">(</span><span class="s1">\'checkbox.js\'</span><span class="p">)</span>\n' +
                '  <span class="p">&lt;/</span><span class="nt">script</span><span class="p">&gt;</span>\n' +
                '<span class="p">&lt;/</span><span class="nt">body</span><span class="p">&gt;</span>\n' +
                '<span class="p">&lt;/</span><span class="nt">html</span><span class="p">&gt;</span>\n' +
                '</code></pre></div><p><br></p><div class="highlight"><pre><code class="language-js"><span></span><span class="kr">class</span> <span class="nx">Checkbox</span> <span class="p">{</span>\n' +
                '  <span class="nx">constructor</span> <span class="p">()</span> <span class="p">{</span>\n' +
                '    <span class="k">this</span><span class="p">.</span><span class="nx">borderColor</span> <span class="o">=</span> <span class="kc">null</span>\n' +
                '    <span class="k">this</span><span class="p">.</span><span class="nx">bgColor</span> <span class="o">=</span> <span class="kc">null</span>\n' +
                '    <span class="k">this</span><span class="p">.</span><span class="nx">lineColor</span> <span class="o">=</span> <span class="kc">null</span>\n' +
                '  <span class="p">}</span>\n' +
                '\n' +
                '  <span class="kr">static</span> <span class="nx">get</span> <span class="nx">inputProperties</span><span class="p">()</span> <span class="p">{</span>\n' +
                '    <span class="k">return</span> <span class="p">[</span><span class="s1">\'--status\'</span><span class="p">,</span> <span class="s1">\'--disabled\'</span><span class="p">,</span> <span class="s1">\'--bg-color\'</span><span class="p">,</span> <span class="s1">\'--border-color\'</span><span class="p">,</span> <span class="s1">\'--line-color\'</span><span class="p">]</span>\n' +
                '  <span class="p">}</span>\n' +
                '\n' +
                '  <span class="nx">paint</span> <span class="p">(</span><span class="nx">ctx</span><span class="p">,</span> <span class="nx">geom</span><span class="p">,</span> <span class="nx">properties</span><span class="p">)</span> <span class="p">{</span>\n' +
                '    <span class="kr">const</span> <span class="p">{</span> <span class="nx">width</span><span class="p">,</span> <span class="nx">height</span> <span class="p">}</span> <span class="o">=</span> <span class="nx">geom</span>\n' +
                '    <span class="kr">const</span> <span class="nx">status</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">getProp</span><span class="p">(</span><span class="nx">properties</span><span class="p">,</span> <span class="s1">\'--status\'</span><span class="p">)</span>\n' +
                '    <span class="kr">const</span> <span class="nx">disabled</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">getProp</span><span class="p">(</span><span class="nx">properties</span><span class="p">,</span> <span class="s1">\'--disabled\'</span><span class="p">)</span>\n' +
                '    <span class="kr">const</span> <span class="nx">borderRadius</span> <span class="o">=</span> <span class="nx">width</span> <span class="o">*</span> <span class="mf">0.2</span>\n' +
                '    <span class="k">this</span><span class="p">.</span><span class="nx">borderColor</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">getProp</span><span class="p">(</span><span class="nx">properties</span><span class="p">,</span> <span class="s1">\'--border-color\'</span><span class="p">)</span>\n' +
                '    <span class="k">this</span><span class="p">.</span><span class="nx">bgColor</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">getProp</span><span class="p">(</span><span class="nx">properties</span><span class="p">,</span> <span class="s1">\'--bg-color\'</span><span class="p">)</span>\n' +
                '    <span class="k">this</span><span class="p">.</span><span class="nx">lineColor</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">getProp</span><span class="p">(</span><span class="nx">properties</span><span class="p">,</span> <span class="s1">\'--line-color\'</span><span class="p">)</span>\n' +
                '    <span class="k">switch</span> <span class="p">(</span><span class="nx">status</span><span class="p">)</span> <span class="p">{</span>\n' +
                '      <span class="k">case</span> <span class="s1">\'unchecked\'</span><span class="o">:</span> <span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">drewUnChecked</span><span class="p">(</span><span class="nx">ctx</span><span class="p">,</span> <span class="nx">width</span><span class="p">,</span> <span class="nx">height</span><span class="p">,</span> <span class="nx">borderRadius</span><span class="p">,</span> <span class="nx">disabled</span><span class="p">)</span>\n' +
                '    <span class="p">}</span> \n' +
                '  <span class="p">}</span>\n'
            };
        },
        components: {FsCommentList, WangEditor}
    };
</script>
