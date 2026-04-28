/**
 * Europe Education Gateway — language switcher (EN / AR / UR / TR)
 * Loads strings from i18n-data.js (window.EEG_I18N)
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'eeg_lang';
    var RTL_LANGS = ['ar', 'ur'];

    function getBundle() {
        return window.EEG_I18N || null;
    }

    function normalizeLang(code) {
        var b = getBundle();
        if (!b || !code) return 'en';
        if (b[code]) return code;
        return 'en';
    }

    function getStoredLang() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setStoredLang(code) {
        try {
            localStorage.setItem(STORAGE_KEY, code);
        } catch (e) { /* ignore */ }
    }

    function currentLang() {
        return normalizeLang(getStoredLang() || 'en');
    }

    function applyLang(lang) {
        lang = normalizeLang(lang);
        var t = getBundle()[lang];
        if (!t) return;

        setStoredLang(lang);

        document.documentElement.setAttribute('lang', lang === 'ur' ? 'ur' : lang);
        var rtl = RTL_LANGS.indexOf(lang) >= 0;
        document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
        document.body.classList.toggle('i18n-rtl', rtl);

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (!key || t[key] === undefined) return;
            el.textContent = t[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (!key || t[key] === undefined) return;
            el.innerHTML = t[key];
        });

        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            var raw = el.getAttribute('data-i18n-attr');
            if (!raw) return;
            var parts = raw.split(':');
            var attr = parts[0];
            var key = parts.slice(1).join(':');
            if (!attr || !key || t[key] === undefined) return;
            el.setAttribute(attr, t[key]);
        });

        var page = document.body.getAttribute('data-page');
        if (page) {
            var mt = t['meta_title_' + page];
            if (mt) document.title = mt;
            var md = document.querySelector('meta[name="description"]');
            var mdk = t['meta_desc_' + page];
            if (md && mdk) md.setAttribute('content', mdk);
        }

        var btn = document.getElementById('langMenuBtn');
        if (btn) {
            var short = t['lang_short_' + lang];
            if (short) btn.textContent = short;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!getBundle()) return;
        applyLang(currentLang());

        document.querySelectorAll('[data-lang-set]').forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                var code = el.getAttribute('data-lang-set');
                applyLang(code);
                var dd = el.closest('.dropdown');
                if (dd && window.bootstrap && bootstrap.Dropdown) {
                    var toggle = dd.querySelector('[data-bs-toggle="dropdown"]');
                    if (toggle) {
                        var inst = bootstrap.Dropdown.getInstance(toggle);
                        if (inst) inst.hide();
                    }
                }
            });
        });
    });

    window.EEG_LANG = {
        apply: applyLang,
        current: currentLang
    };
})();
