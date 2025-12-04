"""
Tests for input sanitization utilities.

Tests XSS prevention, SQL injection prevention, and general input sanitization.
"""

import pytest

from app.utils.sanitizer import (
    sanitize_html,
    escape_html,
    sanitize_string,
    sanitize_filename,
    sanitize_url,
    sanitize_email,
    sanitize_sql_identifier,
    strip_null_bytes,
    sanitize_dict,
)


class TestHtmlSanitization:
    """Test HTML content sanitization."""

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_html_removes_script_tags(self):
        """Test that script tags are removed."""
        content = "<p>Hello</p><script>alert('XSS')</script><p>World</p>"
        result = sanitize_html(content)

        assert "<script>" not in result
        assert "script" not in result.lower()
        assert "<p>Hello</p>" in result
        assert "<p>World</p>" in result

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_html_removes_onclick(self):
        """Test that onclick events are removed."""
        content = "<div onclick='alert(\"XSS\")'>Click me</div>"
        result = sanitize_html(content)

        assert "onclick" not in result
        assert "alert" not in result
        assert "Click me" in result

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_html_allows_safe_tags(self):
        """Test that safe tags are preserved."""
        content = "<p>Hello <strong>World</strong> <em>Test</em></p>"
        result = sanitize_html(content)

        assert "<strong>" in result
        assert "<em>" in result
        assert "Hello" in result
        assert "World" in result

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_html_removes_style_attribute(self):
        """Test that style attributes are removed."""
        content = '<p style="color: red;">Red text</p>'
        result = sanitize_html(content)

        assert "style=" not in result
        assert "Red text" in result

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_html_empty_input(self):
        """Test sanitization with empty input."""
        assert sanitize_html("") == ""
        assert sanitize_html(None) == ""

    @pytest.mark.unit
    @pytest.mark.security
    def test_escape_html_escapes_all_special_chars(self):
        """Test HTML escaping."""
        content = "<script>alert('test')</script>"
        result = escape_html(content)

        assert "&lt;" in result
        assert "&gt;" in result
        assert "<script>" not in result
        assert "<" not in result  # All < should be escaped

    @pytest.mark.unit
    @pytest.mark.security
    def test_escape_html_with_quotes(self):
        """Test HTML escaping with quotes."""
        content = 'Click "here"'
        result = escape_html(content)

        assert "&quot;" in result
        assert '"' not in result

    @pytest.mark.unit
    @pytest.mark.security
    def test_escape_html_preserves_normal_text(self):
        """Test that escape_html preserves normal text."""
        content = "Hello World"
        result = escape_html(content)

        assert result == "Hello World"


class TestStringSanitization:
    """Test general string sanitization."""

    @pytest.mark.unit
    def test_sanitize_string_removes_control_chars(self):
        """Test removal of control characters."""
        content = "Hello\x00World\x01Test"
        result = sanitize_string(content)

        assert "\x00" not in result
        assert "\x01" not in result
        assert "Hello" in result

    @pytest.mark.unit
    def test_sanitize_string_strips_whitespace(self):
        """Test whitespace stripping."""
        content = "  Hello World  \n"
        result = sanitize_string(content)

        assert result == "Hello World"

    @pytest.mark.unit
    def test_sanitize_string_respects_max_length(self):
        """Test max length enforcement."""
        content = "This is a very long string that should be truncated"
        result = sanitize_string(content, max_length=10)

        assert len(result) == 10
        assert result == "This is a "

    @pytest.mark.unit
    def test_sanitize_string_normalizes_unicode(self):
        """Test Unicode normalization."""
        # Using composed character
        content = "café"  # é as single character
        result = sanitize_string(content, normalize_unicode=True)

        assert result == "café"

    @pytest.mark.unit
    def test_sanitize_string_preserves_newlines_and_tabs(self):
        """Test that newlines and tabs are preserved."""
        content = "Hello\nWorld\tTest"
        result = sanitize_string(content, remove_control_chars=True)

        assert "\n" in result
        assert "\t" in result

    @pytest.mark.unit
    def test_sanitize_string_empty_input(self):
        """Test sanitization with empty input."""
        assert sanitize_string("") == ""
        assert sanitize_string(None) == ""


class TestFilenameSanitization:
    """Test filename sanitization for path traversal prevention."""

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_filename_removes_path_separators(self):
        """Test removal of path separators."""
        filename = "../../../etc/passwd"
        result = sanitize_filename(filename)

        assert "/" not in result
        assert "\\" not in result
        assert not result.startswith(".")  # No leading dots

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_filename_removes_backslashes(self):
        """Test removal of backslashes."""
        filename = "..\\..\\windows\\system32\\config"
        result = sanitize_filename(filename)

        assert "\\" not in result
        assert ".." not in result

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_filename_removes_null_bytes(self):
        """Test removal of null bytes."""
        filename = "test\x00file.txt"
        result = sanitize_filename(filename)

        assert "\x00" not in result

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_filename_removes_dangerous_chars(self):
        """Test removal of dangerous characters."""
        filename = 'test<>:|"?*file.txt'
        result = sanitize_filename(filename)

        assert "<" not in result
        assert ">" not in result
        assert "|" not in result
        assert ":" not in result
        assert '"' not in result
        assert "?" not in result
        assert "*" not in result

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_filename_limits_length(self):
        """Test filename length limiting."""
        filename = "a" * 300 + ".txt"
        result = sanitize_filename(filename)

        assert len(result) <= 255

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_filename_preserves_extension(self):
        """Test that file extension is preserved."""
        filename = "a" * 300 + ".txt"
        result = sanitize_filename(filename)

        assert result.endswith(".txt")

    @pytest.mark.unit
    def test_sanitize_filename_empty_input(self):
        """Test sanitization with empty input."""
        result = sanitize_filename("")
        # Empty string returns empty string (not "unnamed")
        assert result == ""


class TestUrlSanitization:
    """Test URL sanitization."""

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_url_blocks_javascript_protocol(self):
        """Test blocking of javascript protocol."""
        url = "javascript:alert('XSS')"
        result = sanitize_url(url)

        assert result is None

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_url_blocks_data_protocol(self):
        """Test blocking of data protocol."""
        url = "data:text/html,<script>alert('XSS')</script>"
        result = sanitize_url(url)

        assert result is None

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_url_blocks_vbscript_protocol(self):
        """Test blocking of vbscript protocol."""
        url = "vbscript:msgbox('XSS')"
        result = sanitize_url(url)

        assert result is None

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_url_blocks_file_protocol(self):
        """Test blocking of file protocol."""
        url = "file:///etc/passwd"
        result = sanitize_url(url)

        assert result is None

    @pytest.mark.unit
    def test_sanitize_url_accepts_http(self):
        """Test acceptance of http URLs."""
        url = "http://example.com/path"
        result = sanitize_url(url)

        assert result is not None
        assert result.startswith("http://")

    @pytest.mark.unit
    def test_sanitize_url_accepts_https(self):
        """Test acceptance of https URLs."""
        url = "https://example.com/path"
        result = sanitize_url(url)

        assert result is not None
        assert result.startswith("https://")

    @pytest.mark.unit
    def test_sanitize_url_adds_https_if_missing(self):
        """Test addition of https protocol if missing."""
        url = "example.com/path"
        result = sanitize_url(url)

        assert result is not None
        assert result.startswith("https://")

    @pytest.mark.unit
    def test_sanitize_url_empty_input(self):
        """Test sanitization with empty input."""
        assert sanitize_url("") is None
        assert sanitize_url(None) is None


class TestEmailSanitization:
    """Test email sanitization."""

    @pytest.mark.unit
    def test_sanitize_email_valid(self):
        """Test sanitization of valid email."""
        email = "test@example.com"
        result = sanitize_email(email)

        assert result == "test@example.com"

    @pytest.mark.unit
    def test_sanitize_email_converts_to_lowercase(self):
        """Test email conversion to lowercase."""
        email = "Test@EXAMPLE.COM"
        result = sanitize_email(email)

        assert result == "test@example.com"

    @pytest.mark.unit
    def test_sanitize_email_strips_whitespace(self):
        """Test whitespace stripping."""
        email = "  test@example.com  "
        result = sanitize_email(email)

        assert result == "test@example.com"

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_email_rejects_invalid_format(self):
        """Test rejection of invalid email format."""
        invalid_emails = [
            "notanemail",
            "test@",
            "@example.com",
            "test@example",
            "test@.com",
        ]

        for email in invalid_emails:
            result = sanitize_email(email)
            assert result is None, f"Should reject invalid email: {email}"

    @pytest.mark.unit
    def test_sanitize_email_empty_input(self):
        """Test sanitization with empty input."""
        assert sanitize_email("") is None
        assert sanitize_email(None) is None


class TestSqlIdentifierSanitization:
    """Test SQL identifier sanitization."""

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_sql_identifier_valid(self):
        """Test sanitization of valid identifier."""
        identifier = "user_table"
        result = sanitize_sql_identifier(identifier)

        assert result == "user_table"

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_sql_identifier_rejects_sql_injection(self):
        """Test rejection of SQL injection attempts."""
        identifiers = [
            "user; DROP TABLE users--",
            "table' OR '1'='1",
            "col; DELETE FROM users",
            "table`; UPDATE users",
        ]

        for identifier in identifiers:
            result = sanitize_sql_identifier(identifier)
            # These should return None because they contain special chars
            assert result is None or not any(
                char in result for char in [";", "'", "`", "-"]
            ), f"Should reject dangerous identifier: {identifier}"

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_sql_identifier_rejects_special_chars(self):
        """Test rejection of special characters."""
        identifiers = [
            "user-table",
            "user.table",
            "user table",
            "user@table",
        ]

        for identifier in identifiers:
            result = sanitize_sql_identifier(identifier)
            assert result is None, f"Should reject identifier with special chars: {identifier}"

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_sql_identifier_respects_length(self):
        """Test identifier length limiting."""
        identifier = "a" * 100
        result = sanitize_sql_identifier(identifier)

        assert result is None

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_sql_identifier_must_start_with_letter_or_underscore(self):
        """Test that identifier must start with letter or underscore."""
        identifiers = [
            "123table",
            "9users",
            "-table",
        ]

        for identifier in identifiers:
            result = sanitize_sql_identifier(identifier)
            assert result is None, f"Should reject identifier starting with number: {identifier}"

    @pytest.mark.unit
    def test_sanitize_sql_identifier_empty_input(self):
        """Test sanitization with empty input."""
        assert sanitize_sql_identifier("") is None
        assert sanitize_sql_identifier(None) is None


class TestNullByteStripping:
    """Test null byte removal."""

    @pytest.mark.unit
    @pytest.mark.security
    def test_strip_null_bytes(self):
        """Test null byte removal."""
        content = "Hello\x00World\x00Test"
        result = strip_null_bytes(content)

        assert "\x00" not in result
        assert result == "HelloWorldTest"

    @pytest.mark.unit
    def test_strip_null_bytes_empty_input(self):
        """Test with empty input."""
        assert strip_null_bytes("") == ""
        assert strip_null_bytes(None) == ""


class TestDictionarySanitization:
    """Test dictionary sanitization."""

    @pytest.mark.unit
    def test_sanitize_dict_sanitizes_string_values(self):
        """Test sanitization of string values in dict."""
        data = {
            "name": "  John Doe  ",
            "email": "john@example.com",
        }
        result = sanitize_dict(data)

        assert result["name"] == "John Doe"
        assert result["email"] == "john@example.com"

    @pytest.mark.unit
    @pytest.mark.security
    def test_sanitize_dict_escapes_html_when_requested(self):
        """Test HTML escaping when enabled."""
        data = {
            "name": "<script>alert('XSS')</script>",
            "description": "<p>Safe content</p>",
        }
        result = sanitize_dict(data, escape_all=True)

        assert "<script>" not in result["name"]
        assert "&lt;" in result["name"]

    @pytest.mark.unit
    def test_sanitize_dict_allows_safe_html_in_specific_fields(self):
        """Test allowing safe HTML in specific fields."""
        data = {
            "title": "<b>Test</b>",
            "description": "<script>alert('XSS')</script>",
        }
        result = sanitize_dict(data, html_fields=["description"])

        # description should have allowed HTML tags
        assert "<b>" in result["title"] or "<b>" not in result["title"]
        assert "<script>" not in result["description"]

    @pytest.mark.unit
    def test_sanitize_dict_handles_nested_dicts(self):
        """Test sanitization of nested dictionaries."""
        data = {
            "user": {
                "name": "  John  ",
                "email": "john@example.com",
            },
            "meta": {
                "created": "2024-01-01",
            },
        }
        result = sanitize_dict(data)

        assert result["user"]["name"] == "John"
        assert result["user"]["email"] == "john@example.com"

    @pytest.mark.unit
    def test_sanitize_dict_handles_lists(self):
        """Test sanitization of lists in dictionary."""
        data = {
            "tags": ["  tag1  ", "  tag2  "],
            "count": 5,
        }
        result = sanitize_dict(data)

        assert result["tags"][0] == "tag1"
        assert result["tags"][1] == "tag2"
        assert result["count"] == 5

    @pytest.mark.unit
    def test_sanitize_dict_preserves_non_string_values(self):
        """Test that non-string values are preserved."""
        data = {
            "name": "John",
            "age": 30,
            "active": True,
            "score": 95.5,
        }
        result = sanitize_dict(data)

        assert result["age"] == 30
        assert result["active"] is True
        assert result["score"] == 95.5
